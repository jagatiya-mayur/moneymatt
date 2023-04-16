import { Document, Types } from "mongoose";

export interface User {
    _id?: Types.ObjectId;
    email: string;
    name: string;
    phone?: string;
    password?: string;
    isPhoneVerified?: boolean;
    role: string;
    balance: number;
    contactId: string;
    referalCode: string;
    active: boolean;
    isRefered: boolean,
    isFirstMoneyAdded: boolean
}

export interface UserDoc extends Document, User {
    comparePassword: (plainText: string) => boolean;
    _id: Types.ObjectId
}

export interface ResetPassBody {
    currentPassword: string;
    newPassword: string;
}

