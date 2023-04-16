import { NextFunction, Request, Response } from "express";
declare class ReferEarnAmountController {
    static getInstance(): ReferEarnAmountController;
    getReferEarnAmount(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateReferEarnAmount(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ReferEarnAmountController;
export default _default;
