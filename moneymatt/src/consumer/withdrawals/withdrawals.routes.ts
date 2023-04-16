import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

import Route from "../../common/interface/routes.interface";
import withdrawalsController from "./withdrawals.controller";
import { verifyWithraw, withdrawBodyDto } from "./withdrawals.dto";

class WithrawalsRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/all', authMiddleware(true), withdrawalsController.allUsersWithdrawHistory);
        this.router.post('/verify', authMiddleware(true), verifyWithraw, validationMiddleware, withdrawalsController.verifyWithdraw);
        this.router.use(authMiddleware());
        this.router.post('/reqWithdraw', withdrawBodyDto, validationMiddleware, withdrawalsController.reqWithdraw);
        this.router.get('/', withdrawalsController.userWithdrawHistory);
    }
}

export default WithrawalsRoute;
