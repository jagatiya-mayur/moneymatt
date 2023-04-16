import { Types } from "mongoose";
import { YantraResult, ResultGetQuery, SetResultBody } from "./yantraResults.interface";
declare class YantraResultsService {
    private yantraResult;
    static getInstance(): YantraResultsService;
    getPeriodInfo(period: number): Promise<(import("./yantraResults.interface").YantraResultDoc & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    currentPeriod(): Promise<any>;
    initializeResult(period: number, date: Date): Promise<void>;
    initializeFutureResult(period: number, date: Date): Promise<void>;
    findIdsByPeriod(period: number): Promise<Array<Types.ObjectId>>;
    findResultByPeriod(period: number): Promise<YantraResult | null>;
    getResultById(_id: Types.ObjectId): Promise<YantraResult>;
    checkResult(_id: Types.ObjectId): Promise<YantraResult>;
    getResults(resultGetQuey: ResultGetQuery): Promise<{
        results: YantraResult[];
        pageSize: number;
        pageNum: number;
        totalPage: number;
        totalResults: number;
    }>;
    getAllResults(): Promise<YantraResult[]>;
    updateRsulttoComplete(period: number): Promise<any>;
    deleteRecords(): Promise<any>;
    setResult(setResultBody: SetResultBody): Promise<void>;
    getCurrentResult(period: number): Promise<{
        finalResult: string;
        totalBetAmount: number;
        gameBoard: any[];
    }>;
    resultDeclaration(period: number): Promise<void>;
    private resultDeclarationPerGame;
    getTotalBetAmount(): Promise<number>;
    getTotalEarning(): Promise<any>;
    getTotalPrize(): Promise<any>;
    getDashBoardData(): Promise<any>;
    getTwoDaysAgoResults(twoDayAgoDate: Date): Promise<Array<Types.ObjectId>>;
    deleteResults(): Promise<any>;
}
declare const _default: YantraResultsService;
export default _default;
