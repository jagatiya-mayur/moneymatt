import { Types, Document } from "mongoose";

export interface Query {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    email: string;
    phone: string;
    query: string;
    status: string;
}

export interface QueryDoc extends Document, Query {
    _id: Types.ObjectId;
}