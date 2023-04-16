import { Types } from "mongoose";
import { NewRecord, Record, RecordQuery } from "./records.interface";
declare class RecordsService {
    private record;
    static getInstance(): RecordsService;
    getRecorById(id: Types.ObjectId): Promise<any>;
    newRecord(userId: Types.ObjectId, newRecordInfo: NewRecord): Promise<{
        record: any;
        balance: number;
    }>;
    getRecordsByColor(gameType: string, period: number, color: string): Promise<Array<Record>>;
    getRecordsByNumber(gameType: string, period: number, number: number): Promise<Array<Record>>;
    getRecordsPerPage(recordQuery: RecordQuery, userId: Types.ObjectId): Promise<{
        records: any[];
        pageSize: number;
        pageNum: number;
        totalPage: number;
        totalResults: any;
    }>;
    updateWinnerBetByColor(resultId: Types.ObjectId, color: string, price: number): Promise<void>;
    updateWinnerBetByNumber(resultId: Types.ObjectId, number: number, price: number): Promise<void>;
    updateFailedBet(period: number): Promise<void>;
    getTotalPriceAmount(period: number): Promise<any>;
    sendResultToSocket(periodId: Types.ObjectId, period: number): Promise<any>;
    getTotalBetAmount(): Promise<number>;
    deleteRecords(resultIds: Array<Types.ObjectId>): Promise<void>;
    buddiesRecodsAmountInfo(userIds: Types.ObjectId[]): Promise<any>;
}
declare const _default: RecordsService;
export default _default;
