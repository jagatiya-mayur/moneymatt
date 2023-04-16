import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";

import referEarnAmountController from "./referEarnAmount.controller";
import { amountsDto } from "./referEarnAmount.dto";

class ReferEarnAmountRoutes implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.use(authMiddleware());
        this.router.get('/', referEarnAmountController.getReferEarnAmount);
        this.router.patch('/', amountsDto, validationMiddleware, referEarnAmountController.updateReferEarnAmount);
    }
}

export default ReferEarnAmountRoutes;