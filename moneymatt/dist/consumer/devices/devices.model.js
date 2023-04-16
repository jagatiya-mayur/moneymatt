"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deviceSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    deviceId: { type: String, required: true, trim: true }
});
const DeviceModel = (0, mongoose_1.model)('device', deviceSchema);
exports.default = DeviceModel;
//# sourceMappingURL=devices.model.js.map