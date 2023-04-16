"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const transactionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    referenceId: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    status: { type: String, enum: globalConst_1.paymentStatus, default: globalConst_1.paymentStatus.pending }
}, {
    timestamps: true
});
const transactionModel = (0, mongoose_1.model)('transaction', transactionSchema);
exports.default = transactionModel;
//# sourceMappingURL=payment.model.js.map