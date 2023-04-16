import { stubArray } from 'lodash';
import { model, Schema } from 'mongoose';
import { recordStatus } from '../../utils/globalConst';

import { Record, RecordDoc } from "./records.interface";

const recordSchema: Schema = new Schema<Record>(
    {
        user: { type: Schema.Types.ObjectId, required: true, red: "user" },
        contractMoney: { type: Number, required: true },
        number: { type: Number },
        color: { type: String },
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

const RecordModel = model<RecordDoc>('record', recordSchema);

export default RecordModel;
