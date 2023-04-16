import { Request, Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";
import { RequestWithUser } from "../../common/auth/auth.interface";

import accountService from "./account.service";
import { Account } from "./account.interface";

let instance: null | AccountController = null;

class AccountController {

    static getInstance(): AccountController {
        if (instance == null) {
            instance = new AccountController();
        }
        return instance;
    }

    public async getAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const accountInfo = await accountService.getAccount();

            return res
                .status(statusCode.OK)
                .json(responseHandler(accountInfo, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const accountInfo: Account = req.body;
            const qrCodeFile: Express.Multer.File | undefined = req.file;

            const updatedAccount: any = await accountService.updateAccount({
                ...accountInfo,
                ...(qrCodeFile && { upiQrCode: qrCodeFile.filename })
            });

            return res
                .status(statusCode.OK)
                .json(responseHandler(updatedAccount, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default AccountController.getInstance();