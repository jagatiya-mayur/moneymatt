"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const otpSchema = new mongoose_1.Schema({
    type: { type: String, enum: globalConst_1.otpType, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    shortCode: { type: Number, required: true },
}, {
    timestamps: true
});
otpSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 120 });
const otpModel = (0, mongoose_1.model)('otp', otpSchema);
exports.default = otpModel;
//# sourceMappingURL=otps.model.js.map