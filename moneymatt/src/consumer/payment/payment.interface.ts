import { Types, Document } from "mongoose";

export interface Transaction {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    referenceId: string;
    date: string;
    amount: number;
    fee: number;
    status: string;
}

export interface TransactionDoc extends Transaction, Document {
    _id: Types.ObjectId;
}

export interface PaymentBody {
    referenceId: string,
    date: string,
    amount: number
}

export interface VerifyPaymentBody {
    userId: Types.ObjectId,
    paymentId: Types.ObjectId,
    status: string
}