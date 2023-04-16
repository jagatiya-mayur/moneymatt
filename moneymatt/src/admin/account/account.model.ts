import { model, Schema } from 'mongoose';
import { Account, AccountDoc } from './account.interface';


const accountSchema: Schema = new Schema<Account>(
    {
        accountNo: { type: Number, default: null },
        ifscCode: { type: String, default: null },
        upiId: { type: String, default: null },
        upiQrCode: { type: String, default: null },
    }
);

const accouontModel = model<AccountDoc>('account', accountSchema);

export default accouontModel;
