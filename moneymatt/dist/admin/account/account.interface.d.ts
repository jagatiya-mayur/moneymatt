import { Document, Types } from "mongoose";
export interface Account {
    _id?: Types.ObjectId;
    accountNo?: number;
    ifscCode?: string;
    upiId?: string;
    upiQrCode?: string;
}
export interface AccountDoc extends Account, Document {
    _id: Types.ObjectId;
}
