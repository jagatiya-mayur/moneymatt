import { Document, Types } from "mongoose";
export interface Withdrawal {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    upiId: string;
    amount: number;
    fee: number;
    status: string;
    date: string;
}
export interface WithdrawalDoc extends Withdrawal, Document {
    _id: Types.ObjectId;
}
export interface WithrawalBody {
    amount: number;
    upiId: string;
    date: string;
}
export interface VerifyWithrawalBody {
    withdrawId: Types.ObjectId;
    userId: Types.ObjectId;
    status: string;
}
