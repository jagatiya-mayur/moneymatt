import { Schema, model } from "mongoose";

import { Referal, ReferalDoc } from "./referals.interface";

const referalSchema: Schema = new Schema<Referal>({
    referedBy: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    referedTo: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    amount: { type: Number, required: true }
});

const referalModel = model<ReferalDoc>("referal", referalSchema);

export default referalModel;