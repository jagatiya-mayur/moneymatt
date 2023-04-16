import { Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import yantraRecordsService from "./yantraRecords.service";
import { RequestWithUser } from "src/common/auth/auth.interface";
import { User } from "src/common/users/users.interface";
import { NewRecord, RecordQuery } from "./yantraRecords.interface";

let instance: null | YantraRecordsController = null;

class YantraRecordsController {

    static getInstance(): YantraRecordsController {
        if (instance == null) {
            instance = new YantraRecordsController();
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

            const newRecord: any = await yantraRecordsService.newRecord(user._id!, newRecordInfo);

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

            const records = await yantraRecordsService.getRecordsPerPage(recordQuery, user._id!);

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

export default YantraRecordsController.getInstance();