"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accountSchema = new mongoose_1.Schema({
    accountNo: { type: Number, default: null },
    ifscCode: { type: String, default: null },
    upiId: { type: String, default: null },
    upiQrCode: { type: String, default: null },
});
const accouontModel = (0, mongoose_1.model)('account', accountSchema);
exports.default = accouontModel;
//# sourceMappingURL=account.model.js.map