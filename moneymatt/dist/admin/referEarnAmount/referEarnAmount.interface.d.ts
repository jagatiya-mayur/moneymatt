import { Document, Types } from "mongoose";
export interface ReferEarnAmount {
    _id?: Types.ObjectId;
    minAmount: number;
    earnAmount: number;
}
export interface ReferEarnAmountDoc extends Document, ReferEarnAmount {
    _id: Types.ObjectId;
}
export interface ReferEarnBody {
    minAmount: string;
    earnAmount: string;
}
