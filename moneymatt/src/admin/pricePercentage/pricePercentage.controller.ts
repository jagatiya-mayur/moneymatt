import { Request, Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";
import { RequestWithUser } from "../../common/auth/auth.interface";

import pricePercentageService from "./pricePercentage.service";


let instance: null | PricePercentageController = null;

class PricePercentageController {

    static getInstance(): PricePercentageController {
        if (instance == null) {
            instance = new PricePercentageController();
        }
        return instance;
    }

    public async getPricePer(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const pricePer: number = await pricePercentageService.getPricePercentage();

            return res
                .status(statusCode.OK)
                .json(responseHandler(pricePer, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updatePricePer(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { giveAwayPer } = req.body as unknown as { giveAwayPer: number };
            const newPercentage: number = await pricePercentageService.updatePricePercentage(giveAwayPer);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newPercentage, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default PricePercentageController.getInstance();