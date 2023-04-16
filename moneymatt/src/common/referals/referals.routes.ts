import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

import Route from "../interface/routes.interface";

import referalsController from "./referals.controller";

import { queryDto } from "./referals.dto";

class ReferalsRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', queryDto, validationMiddleware, referalsController.getUserReferalsInfo);
        this.router.use(authMiddleware());
        this.router.get('/status', referalsController.getReferedUserStatus);
    }
}

export default ReferalsRoute;
