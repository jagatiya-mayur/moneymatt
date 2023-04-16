"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const users_service_1 = __importDefault(require("../../common/users/users.service"));
const env_config_1 = __importDefault(require("../../configs/env.config"));
const withdrawals_model_1 = __importDefault(require("./withdrawals.model"));
const globalConst_1 = require("../../utils/globalConst");
let instance = null;
class FundAccountsService {
    constructor() {
        this.withdraw = withdrawals_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new FundAccountsService();
        }
        return instance;
    }
    async reqWithraw(withdrawBody, userId) {
        return await this.withdraw.create(Object.assign(Object.assign({ user: userId }, withdrawBody), { fee: (env_config_1.default.TRANSACTION_CHARGES * withdrawBody.amount) / 100 }));
    }
    async getwithdrawsByUserId(userId) {
        return await this.withdraw.find({
            user: userId
        }, {
            upiId: 1,
            amount: 1,
            fee: 1,
            status: 1,
            date: 1
        }).sort({ createdAt: -1 });
    }
    async getAllUserWithrawals() {
        return await this.withdraw.find({
            status: globalConst_1.withdrawStatus.pending
        }, {
            amount: 1,
            fee: 1,
            status: 1,
            user: 1,
            upiId: 1,
            date: 1
        })
            .sort({ createdAt: -1 })
            .populate({
            path: "user",
            select: "phone email name balance"
        });
    }
    async verifyWithrawal(verifyWithdrawBody) {
        const { withdrawId, status, userId } = verifyWithdrawBody;
        const withdralInfo = await this.getWithrawInfoById(withdrawId);
        const withdrawInfo = await this.withdraw.findOneAndUpdate({ _id: withdrawId }, {
            status
        }, {
            new: true
        }).lean();
        if (status == globalConst_1.withdrawStatus.failed) {
            await users_service_1.default.updateBalance(userId, withdralInfo.amount);
        }
        return withdralInfo;
    }
    async getWithrawInfoById(withrawId) {
        const withdrawInfo = await this.withdraw.findOne({
            _id: withrawId,
            status: globalConst_1.withdrawStatus.pending
        });
        if (!withdrawInfo) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Withrawal already verified!");
        }
        return withdrawInfo;
    }
}
exports.default = FundAccountsService.getInstance();
//# sourceMappingURL=withdrawals.service.js.map