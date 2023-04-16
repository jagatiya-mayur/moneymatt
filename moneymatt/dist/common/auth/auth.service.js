"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const env_config_1 = __importDefault(require("../../configs/env.config"));
const globalConst_1 = require("../../utils/globalConst");
const users_service_1 = __importDefault(require("../users/users.service"));
const otsps_service_1 = __importDefault(require("../otps/otsps.service"));
const fast2Sms_1 = require("../../utils/fast2Sms");
const devices_service_1 = __importDefault(require("../../consumer/devices/devices.service"));
const referals_service_1 = __importDefault(require("../referals/referals.service"));
const utils_1 = require("../../utils/utils");
let instance = null;
class AuthService {
    static getInstance() {
        if (instance == null) {
            instance = new AuthService();
        }
        return instance;
    }
    async singUp(phone) {
        const newUser = await users_service_1.default.createAccount(phone);
        const otpDetail = await otsps_service_1.default.createOtp(newUser._id, globalConst_1.otpType.signUp);
        await (0, fast2Sms_1.fast2sms)(otpDetail.shortCode, phone);
    }
    async verifySignUpOtp(otpInfo) {
        let referencingUser = null;
        const otpDetails = await otsps_service_1.default.getOtpInfo(otpInfo, globalConst_1.otpType.signUp);
        if (!otpDetails || (otpDetails && !otpDetails.user))
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Invalid OTP!");
        if (otpInfo.referalCode) {
            referencingUser = await referals_service_1.default.validateReferalCode(otpInfo.referalCode);
        }
        const referalCode = (0, utils_1.generateReferalCode)();
        const verifiedUserDetails = await users_service_1.default.updateUser(otpDetails.user._id, {
            name: otpInfo.name,
            isPhoneVerified: true,
            email: otpInfo.email,
            password: (0, bcrypt_1.hashSync)(otpInfo.password, 10),
            referalCode,
            isRefered: otpInfo.referalCode ? true : false
        });
        verifiedUserDetails === null || verifiedUserDetails === void 0 ? true : delete verifiedUserDetails.password;
        await otpDetails.delete();
        const jwt = this.createToken(verifiedUserDetails);
        if (otpInfo.deviceId != "") {
            await devices_service_1.default.addDeviceId(verifiedUserDetails === null || verifiedUserDetails === void 0 ? void 0 : verifiedUserDetails._id, otpInfo.deviceId);
        }
        if (otpInfo.referalCode) {
            await referals_service_1.default.addReferal(verifiedUserDetails === null || verifiedUserDetails === void 0 ? void 0 : verifiedUserDetails._id, referencingUser);
        }
        return { user: verifiedUserDetails, jwt };
    }
    async forgotPassword(phone) {
        const userDetails = await users_service_1.default.getVerfiedUserByPhone(phone);
        if (!userDetails)
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "User not Exists!");
        const otpDetail = await otsps_service_1.default.createOtp(userDetails._id, globalConst_1.otpType.forgotPassword);
        await (0, fast2Sms_1.fast2sms)(otpDetail.shortCode, userDetails.phone);
        return;
    }
    createToken(user) {
        const dataStoredInToken = { userId: user._id };
        const secret = env_config_1.default.JWT_SECRET_KEY;
        return (0, jsonwebtoken_1.sign)(dataStoredInToken, secret, {});
    }
    async verifyForgotPassOtp(otpInfo, password) {
        const otpDetails = await otsps_service_1.default.getOtpInfo(otpInfo, globalConst_1.otpType.forgotPassword);
        if (!otpDetails || (otpDetails && !otpDetails.user))
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Invalid OTP!");
        await otpDetails.delete();
        await this.resetPassword(otpInfo.phone, password);
        return;
    }
    async resetPassword(phone, password) {
        const userDetails = await users_service_1.default.getVerfiedUserByPhone(phone);
        if (!userDetails)
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "User not Exists!");
        await users_service_1.default.changePassword(userDetails, password);
        return;
    }
    async signIn(phone, password, deviceId) {
        const userDetails = await users_service_1.default.getVerfiedUserByPhone(phone);
        let deviceInfo = null;
        if (!(userDetails === null || userDetails === void 0 ? void 0 : userDetails.isPhoneVerified)) {
            throw new HttpException_1.default(globalConst_1.statusCode.CONFLICT, "Phone dosen't exists!");
        }
        const isPasswordCorrect = users_service_1.default.checkPassword(userDetails, password);
        if (!isPasswordCorrect) {
            throw new HttpException_1.default(globalConst_1.statusCode.UNAUTHORIZED, "Wrong password!");
        }
        if (deviceId != "") {
            deviceInfo = await devices_service_1.default.findDeviceId(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id, deviceId);
        }
        if (deviceInfo || userDetails.role == globalConst_1.role.admin) {
            const jwt = this.createToken(userDetails);
            return {
                user: userDetails,
                jwt
            };
        }
        else {
            const otpDetail = await otsps_service_1.default.createOtp(userDetails._id, globalConst_1.otpType.signIn);
            await (0, fast2Sms_1.fast2sms)(otpDetail.shortCode, userDetails.phone);
            return null;
        }
    }
    async verifySignInOtp(otpInfo) {
        const otpDetails = await otsps_service_1.default.getOtpInfo(otpInfo, globalConst_1.otpType.signIn);
        if (!otpDetails || (otpDetails && !otpDetails.user))
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Invalid OTP!");
        const verifiedUserDetails = await users_service_1.default.getVerifiedUserById(otpDetails.user._id);
        await otpDetails.delete();
        const jwt = this.createToken(verifiedUserDetails);
        if (otpInfo.deviceId != "") {
            await devices_service_1.default.addDeviceId(verifiedUserDetails === null || verifiedUserDetails === void 0 ? void 0 : verifiedUserDetails._id, otpInfo.deviceId);
        }
        return { user: verifiedUserDetails, jwt };
    }
    async resendOtp(phone, otpType) {
        const userDetails = await users_service_1.default.getVerfiedUserByPhone(phone);
        if (!userDetails) {
            throw new HttpException_1.default(globalConst_1.statusCode.CONFLICT, "Phone dosen't exists!");
        }
        const otpDetail = await otsps_service_1.default.createOtp(userDetails._id, otpType);
        await (0, fast2Sms_1.fast2sms)(otpDetail.shortCode, phone);
    }
}
exports.default = AuthService.getInstance();
//# sourceMappingURL=auth.service.js.map