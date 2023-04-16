import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";
import recordsController from "./records.controller";
import { newRecordBodyDto, recordQueryDto } from "./records.dto";

class RecordsRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware());
        this.router.get('/', recordQueryDto, validationMiddleware, recordsController.myRecord);
        this.router.post('/newRecord', newRecordBodyDto, validationMiddleware, recordsController.newRecord);
    }
}

export default RecordsRoute;
