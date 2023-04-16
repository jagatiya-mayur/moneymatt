import { Types } from "mongoose";
import { EstimateData, Result, ResultGetQuery, SetResultBody } from "./results.interface";
declare class ResultsService {
    private result;
    static getInstance(): ResultsService;
    getPeriodInfo(period: number): Promise<(import("./results.interface").ResultDoc & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    currentPeriod(gameType: string): Promise<any>;
    initializeResult(period: number, date: Date): Promise<void>;
    initializeFutureResult(period: number, date: Date): Promise<void>;
    updateResult(period: number, result: EstimateData): Promise<void>;
    findIdsByPeriod(period: number): Promise<Array<Types.ObjectId>>;
    findResultsByPeriod(period: number): Promise<Array<Result>>;
    getResultById(_id: Types.ObjectId): Promise<Result>;
    checkResult(_id: Types.ObjectId): Promise<Result>;
    getResults(resultGetQuey: ResultGetQuery): Promise<{
        results: Result[];
        pageSize: number;
        pageNum: number;
        totalPage: number;
        totalResults: number;
    }>;
    getAllResults(): Promise<Result[]>;
    updateRsulttoComplete(period: number): Promise<any>;
    updateTotalPrice(period: number): Promise<void>;
    deleteRecords(): Promise<any>;
    setResult(setResultBody: SetResultBody): Promise<void>;
    getCurrentResult(period: number): Promise<any[]>;
    resultDeclaration(period: number): Promise<void>;
    private resultDeclarationPerGame;
    getTotalBetAmount(): Promise<number>;
    getTotalEarning(): Promise<any>;
    getTotalPrize(): Promise<any>;
    getDashBoardData(): Promise<any>;
    getTwoDaysAgoResults(twoDayAgoDate: Date): Promise<Array<Types.ObjectId>>;
    deleteResults(): Promise<any>;
}
declare const _default: ResultsService;
export default _default;
