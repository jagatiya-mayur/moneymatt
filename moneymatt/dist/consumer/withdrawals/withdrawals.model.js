"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const withdrawalSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    upiId: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    status: { type: String, enum: globalConst_1.withdrawStatus, default: globalConst_1.withdrawStatus.pending },
    date: { type: String, required: true }
}, {
    timestamps: true
});
const withdrawalModel = (0, mongoose_1.model)('withdrawal', withdrawalSchema);
exports.default = withdrawalModel;
//# sourceMappingURL=withdrawals.model.js.map