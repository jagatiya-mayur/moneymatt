import { Response, NextFunction, Request } from "express";
import { RequestWithUser } from "../../common/auth/auth.interface";
declare class FundAccountsController {
    static getInstance(): FundAccountsController;
    reqWithdraw(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    userWithdrawHistory(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    allUsersWithdrawHistory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    verifyWithdraw(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: FundAccountsController;
export default _default;
