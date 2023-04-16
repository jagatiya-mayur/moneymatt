"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const yantraResultSchema = new mongoose_1.Schema({
    period: { type: Number, required: true },
    openPrice: { type: Number, default: 0 },
    yantra: { type: String, enum: globalConst_1.yantra, required: true },
    earnAmount: { type: Number, default: 0 },
    betAmount: { type: Number, default: 0 },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
    isSet: { type: Boolean, default: false },
}, {
    timestamps: true
});
yantraResultSchema.index({
    gameType: 1,
    period: 1
}, {
    unique: true
});
const yantraResultModel = (0, mongoose_1.model)('yantraResult', yantraResultSchema);
exports.default = yantraResultModel;
//# sourceMappingURL=yantraResults.model.js.map