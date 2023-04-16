"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const account_service_1 = __importDefault(require("./account.service"));
let instance = null;
class AccountController {
    static getInstance() {
        if (instance == null) {
            instance = new AccountController();
        }
        return instance;
    }
    async getAccount(req, res, next) {
        try {
            const accountInfo = await account_service_1.default.getAccount();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(accountInfo, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateAccount(req, res, next) {
        try {
            const accountInfo = req.body;
            const qrCodeFile = req.file;
            const updatedAccount = await account_service_1.default.updateAccount(Object.assign(Object.assign({}, accountInfo), (qrCodeFile && { upiQrCode: qrCodeFile.filename })));
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(updatedAccount, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = AccountController.getInstance();
//# sourceMappingURL=account.controller.js.map