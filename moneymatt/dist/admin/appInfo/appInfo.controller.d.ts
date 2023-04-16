import { Request, Response, NextFunction } from "express";
declare class AccountController {
    static getInstance(): AccountController;
    updateAppInfo(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getAppInfo(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: AccountController;
export default _default;
