import { Document, Types } from "mongoose";

export interface Referal {
    _id?: Types.ObjectId;
    referedBy: Types.ObjectId;
    referedTo: Types.ObjectId;
    amount: number;
}

export interface ReferalDoc extends Referal, Document {
    _id: Types.ObjectId;
}