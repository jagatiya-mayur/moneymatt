"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const referals_service_1 = __importDefault(require("./referals.service"));
let instance = null;
class ReferalsController {
    static getInstance() {
        if (instance == null) {
            instance = new ReferalsController();
        }
        return instance;
    }
    async getUserReferalsInfo(req, res, next) {
        try {
            const { phone } = req.query;
            const data = await referals_service_1.default.userReferalsInfo(phone);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(data, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getReferedUserStatus(req, res, next) {
        try {
            const user = req.user;
            const referalData = await referals_service_1.default.referedUserStatus(user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)({
                earnPer: null,
                referals: referalData
            }, globalConst_1.statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = ReferalsController.getInstance();
//# sourceMappingURL=referals.controller.js.map