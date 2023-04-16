import { Response, NextFunction } from "express";
import { RequestWithUser } from "src/common/auth/auth.interface";
declare class YantraRecordsController {
    static getInstance(): YantraRecordsController;
    newRecord(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    myRecord(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: YantraRecordsController;
export default _default;
