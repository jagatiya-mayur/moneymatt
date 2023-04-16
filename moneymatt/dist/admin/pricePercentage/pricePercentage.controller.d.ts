import { Response, NextFunction } from "express";
import { RequestWithUser } from "../../common/auth/auth.interface";
declare class PricePercentageController {
    static getInstance(): PricePercentageController;
    getPricePer(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updatePricePer(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: PricePercentageController;
export default _default;
