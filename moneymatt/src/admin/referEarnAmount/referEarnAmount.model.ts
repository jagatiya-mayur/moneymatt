import { Schema, model } from "mongoose";

import { ReferEarnAmount, ReferEarnAmountDoc } from "./referEarnAmount.interface";

const referEarnAmountSchema = new Schema<ReferEarnAmount>({
    minAmount: { type: Number, required: true },
    earnAmount: { type: Number, required: true }
});

export const referEarnAmountModel = model<ReferEarnAmountDoc>("referEarnAmount", referEarnAmountSchema);