"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resultSchema = new mongoose_1.Schema({
    gameType: { type: String, required: true },
    period: { type: Number, required: true },
    number: { type: Number },
    color: { type: [String] },
    price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    earnAmount: { type: Number, default: 0 },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
    isSet: { type: Boolean, default: false },
}, {
    timestamps: true
});
resultSchema.index({
    gameType: 1,
    period: 1
}, {
    unique: true
});
const ResultModel = (0, mongoose_1.model)('result', resultSchema);
exports.default = ResultModel;
//# sourceMappingURL=results.model.js.map