import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../interface/routes.interface";
import yantraResultsController from "./yantraResults.controller";
import { resultQueryDto, setResultBodyDto } from "./yantraResults.dto";


class YantraResultsRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware());
        this.router.get('/all', yantraResultsController.getAllResults);
        this.router.get('/', resultQueryDto, validationMiddleware, yantraResultsController.getResults);
        this.router.get('/currentPeriod', yantraResultsController.currentPeriod);
        this.router.post('/setResult', setResultBodyDto, validationMiddleware, yantraResultsController.setResult);
        this.router.get('/currentResult', yantraResultsController.getCurrentEstimatedResult);
        this.router.get('/dashboardData', yantraResultsController.getDashBoardData);
        this.router.get('/deleteResults', yantraResultsController.deleteResults);
    }
}

export default YantraResultsRoute;
