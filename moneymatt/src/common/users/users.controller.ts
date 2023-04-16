import { Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";
import _ from "lodash";

import { ResetPassBody, User, UserDoc } from "../users/users.interface";
import { RequestWithUser } from "../auth/auth.interface";
import usersService from "./users.service";

let instance: null | AuthController = null;

class AuthController {

    static getInstance(): AuthController {
        if (instance == null) {
            instance = new AuthController();
        }
        return instance;
    }

    public async changePassword(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const resetPassBody: ResetPassBody = req.body;
            const user: UserDoc = req.user!;

            await usersService.resetPassword(user, resetPassBody);

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async myInfo(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            let user: any = req.user! as unknown as User;

            user.balance = user.balance.toFixed(2);

            return res
                .status(statusCode.OK)
                .json(responseHandler(user, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async myBalance(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            let user: User = req.user! as unknown as User;

            return res
                .status(statusCode.OK)
                .json(responseHandler(
                    {
                        balance: _.round(user.balance, 2),
                        charge: env.TRANSACTION_CHARGES!
                    }, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getUsers(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const users: any = await usersService.getUsers();

            return res
                .status(statusCode.OK)
                .json(responseHandler(users, statusCode.OK, "success"));
        }
        catch (error) {
            console.error(error);

        }
    }
}

export default AuthController.getInstance();