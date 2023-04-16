import { Types, Document } from "mongoose";

export interface YantraResult {
    _id?: Types.ObjectId;
    period: number;
    yantra: string;
    openPrice: number;
    earnAmount: number;
    betAmount: number;
    startTime: number;
    endTime: number;
    isCompleted: boolean;
    isSet: boolean;
}

export interface YantraResultDoc extends Document, YantraResult {
    _id: Types.ObjectId;
}

export interface ResultGetQuery {
    page: number
}

export interface SetResultBody {
    yantra: string;
    period: string
}




