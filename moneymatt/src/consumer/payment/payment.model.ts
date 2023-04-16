import { model, Schema } from 'mongoose';
import { paymentStatus } from '../../utils/globalConst';
import { Transaction, TransactionDoc } from './payment.interface';

const transactionSchema: Schema = new Schema<Transaction>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        referenceId: { type: String, required: true },
        date: { type: String, required: true },
        amount: { type: Number, required: true },
        fee: { type: Number, required: true },
        status: { type: String, enum: paymentStatus, default: paymentStatus.pending }
    },
    {
        timestamps: true
    }
);

const transactionModel = model<TransactionDoc>('transaction', transactionSchema);

export default transactionModel;
