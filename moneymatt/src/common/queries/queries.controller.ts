import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose'

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import { RequestWithUser } from "../auth/auth.interface";
import { User } from "../users/users.interface";
import queriesService from "./queries.service";

let instance: null | ResultsController = null;

class ResultsController {

    static getInstance(): ResultsController {
        if (instance == null) {
            instance = new ResultsController();
        }
        return instance;
    }

    public async newQuery(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const queryData: any = req.body;

            const newQueryDoc: any = await queriesService.newQuery(queryData, user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newQueryDoc, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getUserQueries(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const queries: any = await queriesService.userQueries(user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(queries, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getQueries(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const queries: any = await queriesService.userQueries(user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(queries, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAllQueries(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const quereis: any = await queriesService.getAllQuereis();

            return res
                .status(statusCode.OK)
                .json(responseHandler(quereis, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateQueryStatus(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { queryId } = req.query as unknown as { queryId: Types.ObjectId };

            const updatedQuery: any = await queriesService.queryStatusUpdate(queryId);

            return res
                .status(statusCode.OK)
                .json(responseHandler(updatedQuery, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default ResultsController.getInstance();