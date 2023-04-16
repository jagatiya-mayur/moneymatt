import { Types } from "mongoose";

import { otpType, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { shortCode } from "../../utils/utils";

import appInfoModel from "./appInfo.model";
import { AppInfo, AppInfoDoc } from "./appInfo.interface";

let instance: null | AppInfoService = null;

class AppInfoService {
    public appInfo = appInfoModel;

    static getInstance(): AppInfoService {
        if (instance == null) {
            instance = new AppInfoService();
        }

        return instance;
    }

    public async updateAppInfo(appData: any): Promise<any> {
        return await this.appInfo.findOneAndUpdate(
            {},
            {
                ...appData
            },
            {
                upsert: true,
                new: true
            }
        ).lean().select({ __v: 0 });
    }

    public async getAppInfo(): Promise<any> {
        return await this.appInfo.findOne(
            {},
            {
                __v: 0
            }
        ).lean();
    }
}

export default AppInfoService.getInstance();