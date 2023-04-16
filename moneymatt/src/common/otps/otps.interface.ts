import { Types, Document } from "mongoose";
import { User } from "../users/users.interface";

export interface Otp {
    _id?: Types.ObjectId;
    type: string;
    user: Types.ObjectId | User;
    shortCode: number;
}

export interface OtpDoc extends Document, Otp {
    _id: Types.ObjectId;
}