"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const appInfo_service_1 = __importDefault(require("./appInfo.service"));
let instance = null;
class AccountController {
    static getInstance() {
        if (instance == null) {
            instance = new AccountController();
        }
        return instance;
    }
    async updateAppInfo(req, res, next) {
        try {
            const { version } = req.body;
            const { apk, dmg } = req.files;
            const appData = {
                version,
                apkFile: apk[0].filename,
                dmgFile: dmg[0].filename
            };
            const newAppData = await appInfo_service_1.default.updateAppInfo(appData);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newAppData, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getAppInfo(req, res, next) {
        try {
            const appData = await appInfo_service_1.default.getAppInfo();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(appData, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = AccountController.getInstance();
//# sourceMappingURL=appInfo.controller.js.map