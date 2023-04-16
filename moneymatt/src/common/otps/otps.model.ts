import { model, Schema } from 'mongoose';

import { Otp, OtpDoc } from './otps.interface';
import { otpType } from '../../utils/globalConst';

const otpSchema: Schema = new Schema<Otp>(
    {
        type: { type: String, enum: otpType, required: true },
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        shortCode: { type: Number, required: true },
    },
    {
        timestamps: true
    }
)

otpSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 120 });

const otpModel = model<OtpDoc>('otp', otpSchema);

export default otpModel;
