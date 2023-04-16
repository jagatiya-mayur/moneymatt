import { Types } from "mongoose";
import { NewRecord, YantraRecord, RecordQuery } from "./yantraRecords.interface";
declare class YantraRecordsService {
    private yantraRecord;
    static getInstance(): YantraRecordsService;
    getRecorById(id: Types.ObjectId): Promise<any>;
    newRecord(userId: Types.ObjectId, newRecordInfo: NewRecord): Promise<{
        record: any;
        balance: number;
    }>;
    getRecordsByColor(gameType: string, period: number, color: string): Promise<Array<YantraRecord>>;
    getRecordsByNumber(gameType: string, period: number, number: number): Promise<Array<YantraRecord>>;
    getRecordsPerPage(recordQuery: RecordQuery, userId: Types.ObjectId): Promise<{
        records: any[];
        pageSize: number;
        pageNum: number;
        totalPage: number;
        totalResults: any;
    }>;
    updateFailedBet(period: number): Promise<void>;
    getTotalPriceAmount(period: number): Promise<any>;
    sendResultToSocket(periodId: Types.ObjectId, period: number): Promise<any>;
    getTotalBetAmount(): Promise<number>;
    deleteRecords(resultIds: Array<Types.ObjectId>): Promise<void>;
    getTotalBetsPerYantra(resultId: Types.ObjectId): Promise<any>;
    yantraRecodsAmountInfo(userIds: Types.ObjectId[]): Promise<any>;
}
declare const _default: YantraRecordsService;
export default _default;
