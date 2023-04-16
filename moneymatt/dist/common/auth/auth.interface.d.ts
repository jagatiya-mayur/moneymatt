import { Types } from "mongoose";
import { Request } from "express";
import { User, UserDoc } from "../users/users.interface";
import { otpType } from "../../utils/globalConst";
import { Socket } from "socket.io";
export interface SingUpDetails {
    phone: string;
    email: string;
    password: string;
}
export interface VerifyOtpData {
    phone: string;
    otp: string;
}
export interface SingInOtpData {
    phone: string;
    otp: string;
    deviceId: string;
}
export interface VerifySignUpOtp {
    name: string;
    phone: string;
    otp: string;
    deviceId: string;
    email: string;
    password: string;
    referalCode: string;
}
export interface DataStoredInToken {
    userId: Types.ObjectId;
}
export interface RequestWithUser extends Request {
    user?: UserDoc | null;
}
export interface SocketWithUser extends Socket {
    user?: UserDoc | null;
}
export interface SignInDetails {
    phone: string;
    password: string;
    deviceId: string;
}
export interface SignInResponse {
    user: User;
    jwt: string;
}
export interface ResendOtpBody {
    phone: string;
    otpType: otpType;
}
export interface ForgotPassBody {
    phone: string;
    otp: string;
    password: string;
}
