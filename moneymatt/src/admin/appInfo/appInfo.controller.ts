import { Request, Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import { AppInfo, AppInfoDoc } from "./appInfo.interface";
import appInfoService from "./appInfo.service";

let instance: null | AccountController = null;

class AccountController {

    static getInstance(): AccountController {
        if (instance == null) {
            instance = new AccountController();
        }
        return instance;
    }

    public async updateAppInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const { version }: { version: string } = req.body;
            const { apk, dmg }: any = req.files;

            const appData = {
                version,
                apkFile: apk[0].filename,
                dmgFile: dmg[0].filename
            }

            const newAppData = await appInfoService.updateAppInfo(appData);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newAppData, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAppInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const appData = await appInfoService.getAppInfo();

            return res
                .status(statusCode.OK)
                .json(responseHandler(appData, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default AccountController.getInstance();