"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const yantraRecordSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, red: "user" },
    contractMoney: { type: Number, required: true },
    select: { type: String, enum: globalConst_1.yantra, require: true },
    amount: { type: Number, required: true },
    price: { type: Number, default: 0 },
    fee: { type: Number, required: true },
    status: { type: String, enum: globalConst_1.recordStatus, default: globalConst_1.recordStatus.pending },
    result: { type: mongoose_1.Schema.Types.ObjectId, ref: "result", required: true },
    isCompleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
const yantraRecordModel = (0, mongoose_1.model)('yantraRecord', yantraRecordSchema);
exports.default = yantraRecordModel;
//# sourceMappingURL=yantraRecords.model.js.map