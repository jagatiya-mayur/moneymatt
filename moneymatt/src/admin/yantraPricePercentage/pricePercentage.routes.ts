import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";
import pricePercentageController from "./pricePercentage.controller";
import { percentageDto } from "./pricePercentage.dto";

class PricePercentageRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware(true));
        this.router.get('/', pricePercentageController.getPricePer);
        this.router.post('/', percentageDto, validationMiddleware, pricePercentageController.updatePricePer);
    }
}

export default PricePercentageRoute;
