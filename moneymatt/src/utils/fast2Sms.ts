import axios from "axios";
import env from "../configs/env.config";

export async function fast2sms(otp: number, contactNumber: string) {
    await axios({
        method: "post",
        url: "https://www.fast2sms.com/dev/bulkV2",
        data: {
            variables_values: otp,
            route: "otp",
            numbers: contactNumber,
        },
        headers: {
            authorization: env.FAST2SMS_AUTHORIZATION_KEY
        }
    });
} 