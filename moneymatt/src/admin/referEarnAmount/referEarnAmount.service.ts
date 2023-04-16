import { Types } from "mongoose";

import { otpType, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { shortCode } from "../../utils/utils";

import { referEarnAmountModel } from "./referEarnAmount.model";
import { ReferEarnAmount, ReferEarnBody } from "./referEarnAmount.interface";

let instance: null | ReferEarnAmountService = null;

class ReferEarnAmountService {
    public referEarnAmount = referEarnAmountModel;

    static getInstance(): ReferEarnAmountService {
        if (!instance) {
            instance = new ReferEarnAmountService();
        }
        return instance;
    }

    public async getReferEarnInfo(): Promise<ReferEarnAmount> {
        const referEarnAmountInfo = await
            this.referEarnAmount.findOne().lean();

        if (referEarnAmountInfo) {
            return referEarnAmountInfo;
        }

        return await this.createReferEarn();
    }

    public async createReferEarn(): Promise<any> {
        return await this.referEarnAmount.create({
            minAmount: 100,
            earnAmount: 20
        });
    }

    public async updateReferEarnAmount(referEarnBody: ReferEarnBody): Promise<any> {
        return await this.referEarnAmount.findOneAndUpdate(
            {},
            {
                ...referEarnBody
            },
            { new: true }
        ).lean();
    }
}

export default ReferEarnAmountService.getInstance();