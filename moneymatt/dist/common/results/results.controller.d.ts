import { Request, Response, NextFunction } from "express";
declare class ResultsController {
    static getInstance(): ResultsController;
    currentPeriod(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getResults(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getAllResults(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    setResult(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getCurrentEstimatedResult(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getDashBoardData(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    deleteResults(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ResultsController;
export default _default;
