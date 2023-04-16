"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const referalSchema = new mongoose_1.Schema({
    referedBy: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    referedTo: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    amount: { type: Number, required: true }
});
const referalModel = (0, mongoose_1.model)("referal", referalSchema);
exports.default = referalModel;
//# sourceMappingURL=referals.model.js.map