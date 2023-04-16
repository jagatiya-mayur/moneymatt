"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pricePercentageSchema = new mongoose_1.Schema({
    giveAwayPer: { type: Number, default: 10 }
});
const picePercentageModel = (0, mongoose_1.model)('pricePer', pricePercentageSchema);
exports.default = picePercentageModel;
//# sourceMappingURL=pricePercentage.model.js.map