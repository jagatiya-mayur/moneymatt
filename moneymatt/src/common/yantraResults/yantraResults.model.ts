import { model, Schema, Types } from 'mongoose';
import { yantra } from '../../utils/globalConst';

import { YantraResult, YantraResultDoc } from "./yantraResults.interface";

const yantraResultSchema: Schema = new Schema<YantraResult>(
    {
        period: { type: Number, required: true },
        openPrice: { type: Number, default: 0 },
        yantra: { type: String, enum: yantra, required: true },
        earnAmount: { type: Number, default: 0 },
        betAmount: { type: Number, default: 0 },
        startTime: { type: Number, required: true },
        endTime: { type: Number, required: true },
        isCompleted: { type: Boolean, default: false },
        isSet: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

yantraResultSchema.index(
    {
        gameType: 1,
        period: 1
    },
    {
        unique: true
    }
);

const yantraResultModel = model<YantraResultDoc>('yantraResult', yantraResultSchema);

export default yantraResultModel;
