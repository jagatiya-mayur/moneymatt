import { Types } from "mongoose";

import { role, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { generateReferalCode } from "../../utils/utils";

import referalModel from "./referals.model";

import usersService from "../users/users.service";
import recordsService from "../../consumer/records/records.service";
import yantraRecordsService from "../../consumer/yantraRecords/yantraRecords.service";

import { User } from "../users/users.interface";
import { Referal } from "./referals.interface";
import referEarnAmountService from "../../admin/referEarnAmount/referEarnAmount.service";

let instance: null | ReferalService = null;

class ReferalService {
    private referal = referalModel;

    static getInstance() {
        if (instance == null) {
            instance = new ReferalService();
        }

        return instance;
    }

    public async validateReferalCode(referalCode: string): Promise<Types.ObjectId> {
        const referencingUser: User = await usersService.getUserByReferalCode(referalCode);

        if (!referencingUser)
            throw new HttpException(statusCode.NOT_FOUND, "Invalid reference Code!");

        return referencingUser._id!;
    }

    public async addReferal(referedTo: Types.ObjectId, referedBy: Types.ObjectId): Promise<void> {
        const { earnAmount } = await referEarnAmountService.getReferEarnInfo();

        await this.referal.create({
            referedBy,
            referedTo,
            amount: earnAmount
        });
    }

    public async userReferalsInfo(phone: string): Promise<any> {
        const user: User = await usersService.getUserByPhone(phone);
        const referalsUser = await this.getUsersReferalsUserId(user._id!);

        let buddiesGameRecord: Array<any> = await recordsService.buddiesRecodsAmountInfo(referalsUser);
        const yantraGameRecord: Array<any> = await yantraRecordsService.yantraRecodsAmountInfo(referalsUser);

        if (buddiesGameRecord.length == 0) {
            return yantraGameRecord;
        }

        buddiesGameRecord.forEach((buddiesRecord: any, i: number) => {
            yantraGameRecord.forEach((yantraRecord: any) => {
                if (yantraRecord?._id.toString() == buddiesRecord?._id.toString()) {
                    buddiesRecord.betAmount += yantraRecord.betAmount;
                    buddiesRecord.earnAmount += yantraRecord.earnAmount;
                }
            })
        });

        return buddiesGameRecord;
    }

    public async getUsersReferalsUserId(userId: Types.ObjectId): Promise<Array<Types.ObjectId>> {
        const referalUsersId: Array<Types.ObjectId> = await this.referal.find({
            referedBy: userId
        })
            .transform((doc: any) => {
                return doc.map((rferal: any) => {
                    return rferal.referedTo;
                })
            });

        return referalUsersId;
    }

    public async referedUserStatus(userId: Types.ObjectId): Promise<any> {
        return await this.referal.aggregate([
            {
                '$match': {
                    'referedBy': new Types.ObjectId(userId)
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'referedTo',
                    'foreignField': '_id',
                    'as': 'referedTo'
                }
            }, {
                '$unwind': {
                    'path': '$referedTo'
                }
            }, {
                '$project': {
                    'name': '$referedTo.name',
                    'phone': '$referedTo.phone',
                    'status': {
                        '$cond': {
                            'if': '$referedTo.isFirstMoneyAdded',
                            'then': 'success',
                            'else': 'pending'
                        }
                    },
                    'amount': 1
                }
            }
        ]);
    }

    public async getReferencingUserByUserId(userId: Types.ObjectId): Promise<Types.ObjectId> {
        const referalData: Referal | null = await this.referal.findOne({
            referedTo: userId
        });

        if (!referalData) {
            throw new HttpException(statusCode.NOT_FOUND, "referal data not found!");
        }

        return referalData.referedBy!
    }

    public async getReferalInfo(referedTo: Types.ObjectId): Promise<Referal> {
        return await this.referal.findOne(
            {
                referedTo
            }
        ).lean();
    }
}

export default ReferalService.getInstance();