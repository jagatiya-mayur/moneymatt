import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";
import queriesController from "./queries.controller";
import { newQueryDto } from "./queries.dto";


class QueriesRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware());
        this.router.post("/", newQueryDto, validationMiddleware, queriesController.newQuery);
        this.router.get("/", queriesController.getUserQueries);
        this.router.get("/all", queriesController.getAllQueries);
        this.router.patch("/status", queriesController.updateQueryStatus);
    }
}

export default QueriesRoute;
