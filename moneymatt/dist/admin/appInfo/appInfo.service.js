"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appInfo_model_1 = __importDefault(require("./appInfo.model"));
let instance = null;
class AppInfoService {
    constructor() {
        this.appInfo = appInfo_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new AppInfoService();
        }
        return instance;
    }
    async updateAppInfo(appData) {
        return await this.appInfo.findOneAndUpdate({}, Object.assign({}, appData), {
            upsert: true,
            new: true
        }).lean().select({ __v: 0 });
    }
    async getAppInfo() {
        return await this.appInfo.findOne({}, {
            __v: 0
        }).lean();
    }
}
exports.default = AppInfoService.getInstance();
//# sourceMappingURL=appInfo.service.js.map