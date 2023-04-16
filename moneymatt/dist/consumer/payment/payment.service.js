"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const env_config_1 = __importDefault(require("../../configs/env.config"));
const globalConst_1 = require("../../utils/globalConst");
const payment_model_1 = __importDefault(require("./payment.model"));
const users_service_1 = __importDefault(require("../../common//users/users.service"));
let instance = null;
class PaymentService {
    constructor() {
        this.transaction = payment_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new PaymentService();
        }
        return instance;
    }
    async newPayment(paymentBody, userId) {
        const payment = await this.getPaymentByReferenceId(paymentBody.referenceId);
        if (payment) {
            throw new HttpException_1.default(globalConst_1.statusCode.CONFLICT, "referenceId already exists!");
        }
        return await this.transaction.create(Object.assign(Object.assign({ user: userId }, paymentBody), { fee: (env_config_1.default.TRANSACTION_CHARGES * paymentBody.amount) / 100 }));
    }
    async getPaymentByReferenceId(referenceId) {
        return this.transaction.findOne({ referenceId }).lean();
    }
    async getPaymentsByUserId(userId) {
        return await this.transaction.find({
            user: userId
        }, {
            referenceId: 1,
            date: 1,
            amount: 1,
            fee: 1,
            status: 1
        }).sort({ createdAt: -1 });
    }
    async getAllUserPayments() {
        return await this.transaction.find({
            status: globalConst_1.paymentStatus.pending
        }, {
            referenceId: 1,
            date: 1,
            amount: 1,
            fee: 1,
            status: 1,
            user: 1
        })
            .sort({ createdAt: -1 })
            .populate({
            path: "user",
            select: "phone email name"
        });
        ;
    }
    async verifyPayment(verifyPaymentBody) {
        const { paymentId, status, userId } = verifyPaymentBody;
        const paymentInfo = await this.transaction.findOneAndUpdate({
            _id: paymentId,
            user: userId,
            status: globalConst_1.paymentStatus.pending
        }, {
            status
        }, {
            new: true
        });
        if (!paymentInfo) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Transaction already verified!");
        }
        if (paymentInfo && paymentInfo.status === globalConst_1.paymentStatus.success) {
            const amount = paymentInfo.amount - paymentInfo.fee;
            await users_service_1.default.updateBalance(userId, amount);
        }
        return paymentInfo;
    }
}
exports.default = PaymentService.getInstance();
//# sourceMappingURL=payment.service.js.map