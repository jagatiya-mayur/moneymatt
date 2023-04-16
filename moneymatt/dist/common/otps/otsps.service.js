"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
const otps_model_1 = __importDefault(require("./otps.model"));
let instance = null;
class OtpsService {
    constructor() {
        this.otp = otps_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new OtpsService();
        }
        return instance;
    }
    async createOtp(userId, type) {
        return await this.otp.create({
            user: userId,
            type,
            shortCode: (0, utils_1.shortCode)()
        });
    }
    async getOtpInfo(otpInfo, type) {
        return await this.otp.findOne({
            shortCode: otpInfo.otp,
            type
        }).populate({
            path: 'user',
            match: {
                phone: otpInfo.phone
            }
        });
    }
}
exports.default = OtpsService.getInstance();
//# sourceMappingURL=otsps.service.js.map