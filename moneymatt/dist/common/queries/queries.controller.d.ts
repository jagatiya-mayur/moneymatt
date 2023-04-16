import { Response, NextFunction } from "express";
import { RequestWithUser } from "../auth/auth.interface";
declare class ResultsController {
    static getInstance(): ResultsController;
    newQuery(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getUserQueries(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getQueries(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getAllQueries(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateQueryStatus(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ResultsController;
export default _default;
