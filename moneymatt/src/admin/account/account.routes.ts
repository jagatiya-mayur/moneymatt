import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";

import accountController from "./account.controller";
import { qrCode } from "../../utils/uploader";
import { accountBodyDto } from "./account.dto";

class AccountRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware());
        this.router
            .route('/')
            .get(accountController.getAccount)
            .patch(qrCode.single('upiQrCode'), accountBodyDto, validationMiddleware, accountController.updateAccount)
    }
}

export default AccountRoute;
