import { Types, Document } from "mongoose";

export interface Result {
    _id?: Types.ObjectId;
    gameType: string;
    period: number;
    number: number;
    color: string[];
    price: number;
    earnAmount: number;
    amount: number;
    startTime: number;
    endTime: number;
    isCompleted: boolean;
    isSet: boolean;
}

export interface ResultDoc extends Document, Result {
    _id: Types.ObjectId;
}

export interface ResultGetQuery {
    game: string;
    page: number
}

export interface EstimateData {
    color: string[];
    number: number;
    giveAway: number;
    gameType: string;
    type: string;
    price: number;
}

export interface SetResultBody {
    gameType: string,
    period: number,
    number: number
}
