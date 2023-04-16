import { date } from 'joi';
import { model, Schema } from 'mongoose';
import { withdrawStatus } from '../../utils/globalConst';

import { Withdrawal, WithdrawalDoc } from './withdrawals.interface';

const withdrawalSchema: Schema = new Schema<Withdrawal>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        upiId: { type: String, required: true },
        amount: { type: Number, required: true },
        fee: { type: Number, required: true },
        status: { type: String, enum: withdrawStatus, default: withdrawStatus.pending },
        date: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

const withdrawalModel = model<WithdrawalDoc>('withdrawal', withdrawalSchema);

export default withdrawalModel;
