import { Types } from "mongoose";
import { VerifyWithrawalBody, Withdrawal, WithrawalBody } from "./withdrawals.interface";
declare class FundAccountsService {
    private withdraw;
    static getInstance(): FundAccountsService;
    reqWithraw(withdrawBody: WithrawalBody, userId: Types.ObjectId): Promise<any>;
    getwithdrawsByUserId(userId: Types.ObjectId): Promise<any>;
    getAllUserWithrawals(): Promise<any>;
    verifyWithrawal(verifyWithdrawBody: VerifyWithrawalBody): Promise<any>;
    getWithrawInfoById(withrawId: Types.ObjectId): Promise<Withdrawal>;
}
declare const _default: FundAccountsService;
export default _default;
