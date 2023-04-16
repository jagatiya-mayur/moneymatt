import { model, Schema, Types } from 'mongoose';

import { Result, ResultDoc } from "./results.interface";

const resultSchema: Schema = new Schema<Result>(
    {
        gameType: { type: String, required: true },
        period: { type: Number, required: true },
        number: { type: Number },
        color: { type: [String] },
        price: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
        earnAmount: { type: Number, default: 0 },
        startTime: { type: Number, required: true },
        endTime: { type: Number, required: true },
        isCompleted: { type: Boolean, default: false },
        isSet: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

resultSchema.index(
    {
        gameType: 1,
        period: 1
    },
    {
        unique: true
    }
);
const ResultModel = model<ResultDoc>('result', resultSchema);

export default ResultModel;
