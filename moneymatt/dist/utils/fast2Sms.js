"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fast2sms = void 0;
const axios_1 = __importDefault(require("axios"));
const env_config_1 = __importDefault(require("../configs/env.config"));
async function fast2sms(otp, contactNumber) {
    await (0, axios_1.default)({
        method: "post",
        url: "https://www.fast2sms.com/dev/bulkV2",
        data: {
            variables_values: otp,
            route: "otp",
            numbers: contactNumber,
        },
        headers: {
            authorization: env_config_1.default.FAST2SMS_AUTHORIZATION_KEY
        }
    });
}
exports.fast2sms = fast2sms;
//# sourceMappingURL=fast2Sms.js.map