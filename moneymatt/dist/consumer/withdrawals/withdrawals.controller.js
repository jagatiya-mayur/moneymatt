"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const withdrawals_service_1 = __importDefault(require("./withdrawals.service"));
const users_service_1 = __importDefault(require("../../common/users/users.service"));
let instance = null;
class FundAccountsController {
    static getInstance() {
        if (instance == null) {
            instance = new FundAccountsController();
        }
        return instance;
    }
    async reqWithdraw(req, res, next) {
        try {
            const user = req.user;
            const withrawalBody = req.body;
            if (user.balance < withrawalBody.amount) {
                throw new HttpException_1.default(globalConst_1.statusCode.BAD_REQUEST, "Insufficient balance!");
            }
            const [newWithrawal] = await Promise.all([
                withdrawals_service_1.default.reqWithraw(withrawalBody, user._id),
                users_service_1.default.deductBalance(user._id, withrawalBody.amount)
            ]);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newWithrawal, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async userWithdrawHistory(req, res, next) {
        try {
            const user = req.user;
            const withdrawHistory = await withdrawals_service_1.default.getwithdrawsByUserId(user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(withdrawHistory, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async allUsersWithdrawHistory(req, res, next) {
        try {
            const allUsersHistory = await withdrawals_service_1.default.getAllUserWithrawals();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(allUsersHistory, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async verifyWithdraw(req, res, next) {
        try {
            const verifyWithdrawBody = req.body;
            const withdrawInfo = await withdrawals_service_1.default.verifyWithrawal(verifyWithdrawBody);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(withdrawInfo, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = FundAccountsController.getInstance();
//# sourceMappingURL=withdrawals.controller.js.map