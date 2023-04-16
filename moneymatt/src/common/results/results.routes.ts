import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";
import resultsController from "./results.controller";
import { resultQueryDto, setResultBodyDto } from "./results.dto";


class ResultsRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware());
        this.router.get('/all', resultsController.getAllResults);
        this.router.get('/', resultQueryDto, validationMiddleware, resultsController.getResults);
        this.router.get('/currentPeriod', resultsController.currentPeriod);
        this.router.post('/setResult', setResultBodyDto, validationMiddleware, resultsController.setResult);
        this.router.get('/currentResult', resultsController.getCurrentEstimatedResult);
        this.router.get('/dashboardData', resultsController.getDashBoardData);
        this.router.get('/deleteResults', resultsController.deleteResults);
    }
}

export default ResultsRoute;
