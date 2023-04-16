"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const referEarnAmount_model_1 = require("./referEarnAmount.model");
let instance = null;
class ReferEarnAmountService {
    constructor() {
        this.referEarnAmount = referEarnAmount_model_1.referEarnAmountModel;
    }
    static getInstance() {
        if (!instance) {
            instance = new ReferEarnAmountService();
        }
        return instance;
    }
    async getReferEarnInfo() {
        const referEarnAmountInfo = await this.referEarnAmount.findOne().lean();
        if (referEarnAmountInfo) {
            return referEarnAmountInfo;
        }
        return await this.createReferEarn();
    }
    async createReferEarn() {
        return await this.referEarnAmount.create({
            minAmount: 100,
            earnAmount: 20
        });
    }
    async updateReferEarnAmount(referEarnBody) {
        return await this.referEarnAmount.findOneAndUpdate({}, Object.assign({}, referEarnBody), { new: true }).lean();
    }
}
exports.default = ReferEarnAmountService.getInstance();
//# sourceMappingURL=referEarnAmount.service.js.map