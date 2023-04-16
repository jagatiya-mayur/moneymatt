"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const referEarnAmount_service_1 = __importDefault(require("./referEarnAmount.service"));
let instance = null;
class ReferEarnAmountController {
    static getInstance() {
        if (!instance) {
            instance = new ReferEarnAmountController();
        }
        return instance;
    }
    async getReferEarnAmount(req, res, next) {
        try {
            const referEarnAmountInfo = await referEarnAmount_service_1.default.getReferEarnInfo();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(referEarnAmountInfo, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateReferEarnAmount(req, res, next) {
        try {
            const referEarnBody = req.body;
            const newReferEarnAmounts = await referEarnAmount_service_1.default.updateReferEarnAmount(referEarnBody);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newReferEarnAmounts, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = ReferEarnAmountController.getInstance();
//# sourceMappingURL=referEarnAmount.controller.js.map