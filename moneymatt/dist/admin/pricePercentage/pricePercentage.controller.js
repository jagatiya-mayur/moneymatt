"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const pricePercentage_service_1 = __importDefault(require("./pricePercentage.service"));
let instance = null;
class PricePercentageController {
    static getInstance() {
        if (instance == null) {
            instance = new PricePercentageController();
        }
        return instance;
    }
    async getPricePer(req, res, next) {
        try {
            const pricePer = await pricePercentage_service_1.default.getPricePercentage();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(pricePer, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updatePricePer(req, res, next) {
        try {
            const { giveAwayPer } = req.body;
            const newPercentage = await pricePercentage_service_1.default.updatePricePercentage(giveAwayPer);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newPercentage, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = PricePercentageController.getInstance();
//# sourceMappingURL=pricePercentage.controller.js.map