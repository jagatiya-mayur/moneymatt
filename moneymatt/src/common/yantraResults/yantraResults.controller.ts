import { Request, Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import yantraResultsService from "./yantraResults.service";
import { RequestWithUser } from "../auth/auth.interface";
import { ResultGetQuery, SetResultBody } from "./yantraResults.interface";

let instance: null | YantraResultsController = null;

class YantraResultsController {

    static getInstance(): YantraResultsController {
        if (instance == null) {
            instance = new YantraResultsController();
        }
        return instance;
    }

    public async currentPeriod(req: Request, res: Response, next: NextFunction) {
        try {
            const periodInfo = await yantraResultsService.currentPeriod();

            return res
                .status(statusCode.OK)
                .json(responseHandler(periodInfo, statusCode.OK, "success"));
        }
        catch (error) {

        }
    }

    public async getResults(req: Request, res: Response, next: NextFunction) {
        try {
            const resultGetQuey: ResultGetQuery = req.query as unknown as ResultGetQuery;

            const results: any = await yantraResultsService.getResults(resultGetQuey);

            return res
                .status(statusCode.OK)
                .json(responseHandler(results, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAllResults(req: Request, res: Response, next: NextFunction) {
        try {
            const results: any = await yantraResultsService.getAllResults();

            return res
                .status(statusCode.OK)
                .json(responseHandler(results, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async setResult(req: Request, res: Response, next: NextFunction) {
        try {
            const setResultBody: SetResultBody = req.body;

            await yantraResultsService.setResult(setResultBody);

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getCurrentEstimatedResult(req: Request, res: Response, next: NextFunction) {
        try {
            const { period } = req.query as unknown as { period: number };

            const resultInfo: any = await yantraResultsService.getCurrentResult(period);

            return res
                .status(statusCode.OK)
                .json(responseHandler(resultInfo, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getDashBoardData(req: Request, res: Response, next: NextFunction) {
        try {
            const deshboardData: any = await yantraResultsService.getDashBoardData();

            return res
                .status(statusCode.OK)
                .json(responseHandler(deshboardData, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteResults(req: Request, res: Response, next: NextFunction) {
        try {
            await yantraResultsService.deleteResults();

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default YantraResultsController.getInstance();