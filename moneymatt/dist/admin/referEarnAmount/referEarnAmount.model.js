"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referEarnAmountModel = void 0;
const mongoose_1 = require("mongoose");
const referEarnAmountSchema = new mongoose_1.Schema({
    minAmount: { type: Number, required: true },
    earnAmount: { type: Number, required: true }
});
exports.referEarnAmountModel = (0, mongoose_1.model)("referEarnAmount", referEarnAmountSchema);
//# sourceMappingURL=referEarnAmount.model.js.map