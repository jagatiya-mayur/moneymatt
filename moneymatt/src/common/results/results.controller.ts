import { Request, Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import resultsService from "./results.service";
import { RequestWithUser } from "../auth/auth.interface";
import { ResultGetQuery, SetResultBody } from "./results.interface";

let instance: null | ResultsController = null;

class ResultsController {

    static getInstance(): ResultsController {
        if (instance == null) {
            instance = new ResultsController();
        }
        return instance;
    }

    public async currentPeriod(req: Request, res: Response, next: NextFunction) {
        try {
            const { game } = req.query as unknown as { game: string };

            const periodInfo = await resultsService.currentPeriod(game);

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

            const results: any = await resultsService.getResults(resultGetQuey);

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
            const results: any = await resultsService.getAllResults();

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

            await resultsService.setResult(setResultBody);

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

            const resultInfo: any = await resultsService.getCurrentResult(period);

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
            const deshboardData: any = await resultsService.getDashBoardData();

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
            await resultsService.deleteResults();
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

export default ResultsController.getInstance();