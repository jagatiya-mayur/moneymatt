"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const env_config_1 = __importDefault(require("../../configs/env.config"));
const lodash_1 = __importDefault(require("lodash"));
const users_service_1 = __importDefault(require("./users.service"));
let instance = null;
class AuthController {
    static getInstance() {
        if (instance == null) {
            instance = new AuthController();
        }
        return instance;
    }
    async changePassword(req, res, next) {
        try {
            const resetPassBody = req.body;
            const user = req.user;
            await users_service_1.default.resetPassword(user, resetPassBody);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async myInfo(req, res, next) {
        try {
            let user = req.user;
            user.balance = user.balance.toFixed(2);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(user, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async myBalance(req, res, next) {
        try {
            let user = req.user;
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)({
                balance: lodash_1.default.round(user.balance, 2),
                charge: env_config_1.default.TRANSACTION_CHARGES
            }, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await users_service_1.default.getUsers();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(users, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.default = AuthController.getInstance();
//# sourceMappingURL=users.controller.js.map