import { Types } from "mongoose";
import { User } from "../../common/users/users.interface";
import axios from "axios";

import HttpException from "../../exceptions/HttpException";

import usersService from "../../common/users/users.service";
import env from "../../configs/env.config";

import withdrawalModel from "./withdrawals.model";
import { accountTypes, statusCode, withdrawStatus } from "../../utils/globalConst";
import { deduct2Per, twoPerOfValue } from "../../utils/utils";
import { VerifyWithrawalBody, Withdrawal, WithrawalBody } from "./withdrawals.interface";

let instance: null | FundAccountsService = null;

class FundAccountsService {
    private withdraw = withdrawalModel;

    static getInstance(): FundAccountsService {
        if (instance == null) {
            instance = new FundAccountsService();
        }

        return instance;
    }

    public async reqWithraw(withdrawBody: WithrawalBody, userId: Types.ObjectId): Promise<any> {

        return await this.withdraw.create(
            {
                user: userId,
                ...withdrawBody,
                fee: (env.TRANSACTION_CHARGES * withdrawBody.amount) / 100
            }
        );
    }

    public async getwithdrawsByUserId(userId: Types.ObjectId): Promise<any> {
        return await this.withdraw.find(
            {
                user: userId
            },
            {
                upiId: 1,
                amount: 1,
                fee: 1,
                status: 1,
                date: 1
            }
        ).sort({ createdAt: -1 });
    }

    public async getAllUserWithrawals(): Promise<any> {
        return await this.withdraw.find(
            {
                status: withdrawStatus.pending
            },
            {
                amount: 1,
                fee: 1,
                status: 1,
                user: 1,
                upiId: 1,
                date: 1
            }
        )
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "phone email name balance"
            });
    }

    public async verifyWithrawal(verifyWithdrawBody: VerifyWithrawalBody): Promise<any> {
        const { withdrawId, status, userId } = verifyWithdrawBody;
        const withdralInfo = await this.getWithrawInfoById(withdrawId);

        const withdrawInfo: Withdrawal | null = await this.withdraw.findOneAndUpdate(
            { _id: withdrawId },
            {
                status
            },
            {
                new: true
            }
        ).lean();

        if (status == withdrawStatus.failed) {
            await usersService.updateBalance(userId, withdralInfo.amount);
        }

        return withdralInfo;
    }

    public async getWithrawInfoById(withrawId: Types.ObjectId): Promise<Withdrawal> {
        const withdrawInfo: Withdrawal | null = await this.withdraw.findOne(
            {
                _id: withrawId,
                status: withdrawStatus.pending
            }
        );

        if (!withdrawInfo) {
            throw new HttpException(statusCode.NOT_FOUND, "Withrawal already verified!");
        }

        return withdrawInfo
    }
}
export default FundAccountsService.getInstance();