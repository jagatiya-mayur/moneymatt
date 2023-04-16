import { Types, Document } from "mongoose";
import { Result } from "../../common/results/results.interface";
import { colors } from "../../utils/globalConst";

export interface Record {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    contractMoney: number;
    fee: number;
    number?: number,
    color?: string,
    amount: number;
    price: number;
    status: string;
    result: Types.ObjectId | Result;
    isCompleted: boolean;
}

export interface RecordDoc extends Document, Record {
    _id: Types.ObjectId
}

export interface NewRecord {
    periodId: Types.ObjectId;
    contractMoney: number;
    number?: number;
    color?: colors;
}

export interface RecordQuery {
    game: string;
    page: number;
}

export interface NumberBetTotal{
    _id: number,
    totalAmount: number
}

export interface ColorBetTotal{
    _id: string,
    totalAmount: number
}