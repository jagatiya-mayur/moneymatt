import { Types } from "mongoose";

import { otpType, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { responseHandler, shortCode } from "../../utils/utils";
import { NextFunction, Request, Response } from "express";

import referEarnAmountService from "./referEarnAmount.service";
import { ReferEarnBody } from "./referEarnAmount.interface";

let instance: null | ReferEarnAmountController = null;

class ReferEarnAmountController {

    static getInstance() {
        if (!instance) {
            instance = new ReferEarnAmountController();
        }
        return instance;
    }

    public async getReferEarnAmount(req: Request, res: Response, next: NextFunction) {
        try {
            const referEarnAmountInfo: any = await referEarnAmountService.getReferEarnInfo();

            return res
                .status(statusCode.OK)
                .json(responseHandler(referEarnAmountInfo, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateReferEarnAmount(req: Request, res: Response, next: NextFunction) {
        try {
            const referEarnBody: ReferEarnBody = req.body;

            const newReferEarnAmounts: any = await
                referEarnAmountService.updateReferEarnAmount(referEarnBody);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newReferEarnAmounts, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default ReferEarnAmountController.getInstance();