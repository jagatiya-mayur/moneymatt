import { Types } from "mongoose";

import { otpType, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { shortCode } from "../../utils/utils";

import otpModel from "./otps.model";
import { Otp, OtpDoc } from "./otps.interface";
import { VerifyOtpData } from "../auth/auth.interface";

let instance: null | OtpsService = null;

class OtpsService {
    public otp = otpModel;

    static getInstance(): OtpsService {
        if (instance == null) {
            instance = new OtpsService();
        }

        return instance;
    }

    public async createOtp(userId: Types.ObjectId, type: otpType): Promise<Otp> {
        return await this.otp.create({
            user: userId,
            type,
            shortCode: shortCode()
        });
    }

    public async getOtpInfo(otpInfo: VerifyOtpData, type: otpType): Promise<OtpDoc | null> {
        return await this.otp.findOne(
            {
                shortCode: otpInfo.otp,
                type
            }
        ).populate({
            path: 'user',
            match: {
                phone: otpInfo.phone
            }
        });
    }

}

export default OtpsService.getInstance();