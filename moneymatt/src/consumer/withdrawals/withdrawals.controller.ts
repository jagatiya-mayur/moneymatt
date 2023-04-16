import { Response, NextFunction, Request } from "express";
import { Types } from "mongoose";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";
import { RequestWithUser } from "../../common/auth/auth.interface";
import { User } from "../../common/users/users.interface";

import withdrawalsService from "./withdrawals.service";
import { VerifyWithrawalBody, WithrawalBody } from "./withdrawals.interface";
import usersService from "../../common/users/users.service";


let instance: null | FundAccountsController = null;

class FundAccountsController {

    static getInstance(): FundAccountsController {
        if (instance == null) {
            instance = new FundAccountsController();
        }
        return instance;
    }

    public async reqWithdraw(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const withrawalBody: WithrawalBody = req.body;

            if (user.balance < withrawalBody.amount) {
                throw new HttpException(statusCode.BAD_REQUEST, "Insufficient balance!");
            }

            // const newWithrawal = await withdrawalsService.reqWithraw(withrawalBody, user._id!);

            const [newWithrawal] = await Promise.all([
                withdrawalsService.reqWithraw(withrawalBody, user._id!), // new withdraw request
                usersService.deductBalance(user._id!, withrawalBody.amount)
            ]);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newWithrawal, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async userWithdrawHistory(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!

            const withdrawHistory = await withdrawalsService.getwithdrawsByUserId(user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(withdrawHistory, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async allUsersWithdrawHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const allUsersHistory = await withdrawalsService.getAllUserWithrawals();

            return res
                .status(statusCode.OK)
                .json(responseHandler(allUsersHistory, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async verifyWithdraw(req: Request, res: Response, next: NextFunction) {
        try {
            const verifyWithdrawBody: VerifyWithrawalBody = req.body;

            const withdrawInfo = await withdrawalsService.verifyWithrawal(verifyWithdrawBody);

            return res
                .status(statusCode.OK)
                .json(responseHandler(withdrawInfo, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default FundAccountsController.getInstance();