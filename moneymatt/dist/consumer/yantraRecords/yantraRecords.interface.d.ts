import { Types, Document } from "mongoose";
import { Result } from "../../common/results/results.interface";
export interface YantraRecord {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    contractMoney: number;
    fee: number;
    select: string;
    amount: number;
    price: number;
    status: string;
    result: Types.ObjectId | Result;
    isCompleted: boolean;
}
export interface YantraRecordDoc extends Document, YantraRecord {
    _id: Types.ObjectId;
}
export interface NewRecord {
    periodId: Types.ObjectId;
    contractMoney: number;
    yantra: string;
}
export interface RecordQuery {
    game: string;
    page: number;
}
export interface NumberBetTotal {
    _id: number;
    totalAmount: number;
}
export interface ColorBetTotal {
    _id: string;
    totalAmount: number;
}
