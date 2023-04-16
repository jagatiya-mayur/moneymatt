import { Types, Document } from "mongoose";
export interface PricePercentage {
    _id?: Types.ObjectId;
    giveAwayPer: number;
    isChanged: boolean;
}
export interface PricePercentageDoc extends Document, PricePercentage {
    _id: Types.ObjectId;
}
