"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const env_config_1 = __importDefault(require("../../configs/env.config"));
const payment_service_1 = __importDefault(require("./payment.service"));
const users_service_1 = __importDefault(require("../../common/users/users.service"));
const referals_service_1 = __importDefault(require("../../common/referals/referals.service"));
let instance = null;
class PaymentController {
    static getInstance() {
        if (instance == null) {
            instance = new PaymentController();
        }
        return instance;
    }
    getTransactionCharge(req, res, next) {
        return res
            .status(globalConst_1.statusCode.OK)
            .json((0, utils_1.responseHandler)({ charge: env_config_1.default.TRANSACTION_CHARGES }, globalConst_1.statusCode.OK, 'success'));
    }
    async reqPayment(req, res, next) {
        try {
            const user = req.user;
            const paymentBody = req.body;
            const newPayment = await payment_service_1.default.newPayment(paymentBody, user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newPayment, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async userPaymentHistory(req, res, next) {
        try {
            const user = req.user;
            const paymentHistory = await payment_service_1.default.getPaymentsByUserId(user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(paymentHistory, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async allUsersPaymentHistory(req, res, next) {
        try {
            const allUsersHistory = await payment_service_1.default.getAllUserPayments();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(allUsersHistory, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async verifyPayment(req, res, next) {
        try {
            const verifyPaymentBody = req.body;
            const paymentInfo = await payment_service_1.default.verifyPayment(verifyPaymentBody);
            const user = await users_service_1.default.getVerifiedUserById(verifyPaymentBody.userId);
            if (verifyPaymentBody.status == globalConst_1.paymentStatus.success) {
                if ((user === null || user === void 0 ? void 0 : user.isRefered) && ((user === null || user === void 0 ? void 0 : user.isFirstMoneyAdded) === false)) {
                    const referalInfo = await referals_service_1.default.getReferalInfo(user._id);
                    if (referalInfo) {
                        await users_service_1.default.addReferalEarnMoney(referalInfo.referedBy, referalInfo.amount);
                    }
                    await users_service_1.default.userAddedFirstMoney(user._id);
                }
            }
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(paymentInfo, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = PaymentController.getInstance();
//# sourceMappingURL=payment.controller.js.map