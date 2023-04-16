import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../../common/auth/auth.interface";
declare class PaymentController {
    static getInstance(): PaymentController;
    getTransactionCharge(req: RequestWithUser, res: Response, next: NextFunction): Response<any, Record<string, any>>;
    reqPayment(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    userPaymentHistory(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    allUsersPaymentHistory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: PaymentController;
export default _default;
