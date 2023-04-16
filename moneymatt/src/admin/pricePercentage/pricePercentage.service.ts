import { Types } from "mongoose";

import { otpType, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { shortCode } from "../../utils/utils";

import pricePercentageModel from "./pricePercentage.model";
import { PricePercentage, PricePercentageDoc } from "./pricePercentage.interface";

let instance: null | PricePercentageService = null;

class PricePercentageService {
    public pricePercentageModel = pricePercentageModel;

    static getInstance(): PricePercentageService {
        if (instance == null) {
            instance = new PricePercentageService();
        }

        return instance;
    }

    public async getOnePricePercentage(): Promise<PricePercentage> {
        return await this.pricePercentageModel.findOne().lean();
    }

    public async getPricePercentage(): Promise<any> {
        const pricePercentage = await this.getOnePricePercentage();

        if (pricePercentage) return pricePercentage.giveAwayPer;

        const newPricePercentage: PricePercentageDoc = await this.pricePercentageModel.create({});
        return newPricePercentage.giveAwayPer;
    }

    public async updatePricePercentage(percentage: number): Promise<number> {
        const updatedPricePercentage: PricePercentageDoc = await this.pricePercentageModel.findOneAndUpdate(
            {},
            {
                giveAwayPer: percentage
            },
            {
                upsert: true,
                new: true
            }
        ).lean();

        return updatedPricePercentage.giveAwayPer;
    }
}

export default PricePercentageService.getInstance();