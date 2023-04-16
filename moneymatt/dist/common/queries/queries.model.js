"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const querySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, red: "user" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    query: { type: String, required: true },
    status: { type: String, enum: globalConst_1.queryStatus, default: globalConst_1.queryStatus.pending }
}, {
    timestamps: true
});
const QueryModel = (0, mongoose_1.model)('query', querySchema);
exports.default = QueryModel;
//# sourceMappingURL=queries.model.js.map