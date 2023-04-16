import { otpType } from "../../utils/globalConst";
import { UserDoc } from "../users/users.interface";
import { SignInResponse, SingInOtpData, VerifyOtpData, VerifySignUpOtp } from "./auth.interface";
declare class AuthService {
    static getInstance(): AuthService;
    singUp(phone: string): Promise<void>;
    verifySignUpOtp(otpInfo: VerifySignUpOtp): Promise<{
        user: UserDoc;
        jwt: string;
    }>;
    forgotPassword(phone: string): Promise<void>;
    createToken(user: UserDoc): string;
    verifyForgotPassOtp(otpInfo: VerifyOtpData, password: string): Promise<void>;
    resetPassword(phone: string, password: string): Promise<void>;
    signIn(phone: string, password: string, deviceId: string): Promise<SignInResponse | null>;
    verifySignInOtp(otpInfo: SingInOtpData): Promise<{
        user: UserDoc;
        jwt: string;
    }>;
    resendOtp(phone: string, otpType: otpType): Promise<any>;
}
declare const _default: AuthService;
export default _default;
