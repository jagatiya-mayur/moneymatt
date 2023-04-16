"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pricePercentage_model_1 = __importDefault(require("./pricePercentage.model"));
let instance = null;
class PricePercentageService {
    constructor() {
        this.pricePercentageModel = pricePercentage_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new PricePercentageService();
        }
        return instance;
    }
    async getOnePricePercentage() {
        return await this.pricePercentageModel.findOne().lean();
    }
    async getPricePercentage() {
        const pricePercentage = await this.getOnePricePercentage();
        if (pricePercentage)
            return pricePercentage.giveAwayPer;
        const newPricePercentage = await this.pricePercentageModel.create({});
        return newPricePercentage.giveAwayPer;
    }
    async updatePricePercentage(percentage) {
        const updatedPricePercentage = await this.pricePercentageModel.findOneAndUpdate({}, {
            giveAwayPer: percentage
        }, {
            upsert: true,
            new: true
        }).lean();
        return updatedPricePercentage.giveAwayPer;
    }
}
exports.default = PricePercentageService.getInstance();
//# sourceMappingURL=pricePercentage.service.js.map