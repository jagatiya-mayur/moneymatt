import { Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import recordsService from "./records.service";
import { RequestWithUser } from "src/common/auth/auth.interface";
import { User } from "src/common/users/users.interface";
import { NewRecord, RecordQuery } from "./records.interface";

let instance: null | RecordsController = null;

class RecordsController {

    static getInstance(): RecordsController {
        if (instance == null) {
            instance = new RecordsController();
        }
        return instance;
    }

    public async newRecord(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const newRecordInfo: NewRecord = req.body;

            if (user.balance < newRecordInfo.contractMoney) {
                throw new HttpException(statusCode.BAD_REQUEST, "Insufficient Balance!");
            }

            const newRecord: any = await recordsService.newRecord(user._id!, newRecordInfo);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newRecord, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async myRecord(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const recordQuery: RecordQuery = req.query as unknown as RecordQuery;

            const records = await recordsService.getRecordsPerPage(recordQuery, user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(records, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default RecordsController.getInstance();