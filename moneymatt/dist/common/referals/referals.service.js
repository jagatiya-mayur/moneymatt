"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const referals_model_1 = __importDefault(require("./referals.model"));
const users_service_1 = __importDefault(require("../users/users.service"));
const records_service_1 = __importDefault(require("../../consumer/records/records.service"));
const yantraRecords_service_1 = __importDefault(require("../../consumer/yantraRecords/yantraRecords.service"));
const referEarnAmount_service_1 = __importDefault(require("../../admin/referEarnAmount/referEarnAmount.service"));
let instance = null;
class ReferalService {
    constructor() {
        this.referal = referals_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new ReferalService();
        }
        return instance;
    }
    async validateReferalCode(referalCode) {
        const referencingUser = await users_service_1.default.getUserByReferalCode(referalCode);
        if (!referencingUser)
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Invalid reference Code!");
        return referencingUser._id;
    }
    async addReferal(referedTo, referedBy) {
        const { earnAmount } = await referEarnAmount_service_1.default.getReferEarnInfo();
        await this.referal.create({
            referedBy,
            referedTo,
            amount: earnAmount
        });
    }
    async userReferalsInfo(phone) {
        const user = await users_service_1.default.getUserByPhone(phone);
        const referalsUser = await this.getUsersReferalsUserId(user._id);
        let buddiesGameRecord = await records_service_1.default.buddiesRecodsAmountInfo(referalsUser);
        const yantraGameRecord = await yantraRecords_service_1.default.yantraRecodsAmountInfo(referalsUser);
        if (buddiesGameRecord.length == 0) {
            return yantraGameRecord;
        }
        buddiesGameRecord.forEach((buddiesRecord, i) => {
            yantraGameRecord.forEach((yantraRecord) => {
                if ((yantraRecord === null || yantraRecord === void 0 ? void 0 : yantraRecord._id.toString()) == (buddiesRecord === null || buddiesRecord === void 0 ? void 0 : buddiesRecord._id.toString())) {
                    buddiesRecord.betAmount += yantraRecord.betAmount;
                    buddiesRecord.earnAmount += yantraRecord.earnAmount;
                }
            });
        });
        return buddiesGameRecord;
    }
    async getUsersReferalsUserId(userId) {
        const referalUsersId = await this.referal.find({
            referedBy: userId
        })
            .transform((doc) => {
            return doc.map((rferal) => {
                return rferal.referedTo;
            });
        });
        return referalUsersId;
    }
    async referedUserStatus(userId) {
        return await this.referal.aggregate([
            {
                '$match': {
                    'referedBy': new mongoose_1.Types.ObjectId(userId)
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
    async getReferencingUserByUserId(userId) {
        const referalData = await this.referal.findOne({
            referedTo: userId
        });
        if (!referalData) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "referal data not found!");
        }
        return referalData.referedBy;
    }
    async getReferalInfo(referedTo) {
        return await this.referal.findOne({
            referedTo
        }).lean();
    }
}
exports.default = ReferalService.getInstance();
//# sourceMappingURL=referals.service.js.map