import { Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import { ResetPassBody, User, UserDoc } from "../users/users.interface";
import { RequestWithUser } from "../auth/auth.interface";

import referalsService from "./referals.service";

let instance: null | ReferalsController = null;

class ReferalsController {

    static getInstance(): ReferalsController {
        if (instance == null) {
            instance = new ReferalsController();
        }
        return instance;
    }

    public async getUserReferalsInfo(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { phone } = req.query as unknown as { phone: string };

            const data: any = await referalsService.userReferalsInfo(phone);

            return res
                .status(statusCode.OK)
                .json(responseHandler(data, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getReferedUserStatus(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;

            const referalData: any = await referalsService.referedUserStatus(user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler({
                    earnPer: null,
                    referals: referalData
                }, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default ReferalsController.getInstance();