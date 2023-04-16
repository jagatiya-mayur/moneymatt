import { model, Schema } from 'mongoose';
import { recordStatus, yantra } from '../../utils/globalConst';

import { YantraRecord, YantraRecordDoc } from "./yantraRecords.interface";

const yantraRecordSchema: Schema = new Schema<YantraRecord>(
    {
        user: { type: Schema.Types.ObjectId, required: true, red: "user" },
        contractMoney: { type: Number, required: true },
        select: { type: String, enum: yantra, require: true },
        amount: { type: Number, required: true },
        price: { type: Number, default: 0 },
        fee: { type: Number, required: true },
        status: { type: String, enum: recordStatus, default: recordStatus.pending },
        result: { type: Schema.Types.ObjectId, ref: "result", required: true },
        isCompleted: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

const yantraRecordModel = model<YantraRecordDoc>('yantraRecord', yantraRecordSchema);

export default yantraRecordModel;
