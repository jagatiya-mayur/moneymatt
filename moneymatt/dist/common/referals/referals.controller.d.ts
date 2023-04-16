import { Response, NextFunction } from "express";
import { RequestWithUser } from "../auth/auth.interface";
declare class ReferalsController {
    static getInstance(): ReferalsController;
    getUserReferalsInfo(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getReferedUserStatus(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ReferalsController;
export default _default;
