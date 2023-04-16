"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appInfoSchema = new mongoose_1.Schema({
    version: { type: String, default: null },
    apkFile: { type: String, default: null },
    dmgFile: { type: String, default: null }
});
const appInfoModel = (0, mongoose_1.model)('appInfo', appInfoSchema);
exports.default = appInfoModel;
//# sourceMappingURL=appInfo.model.js.map