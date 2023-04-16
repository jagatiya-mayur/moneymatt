import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

import Route from "../interface/routes.interface";
import usersController from "./users.controller";
import { resetPassBodyDto } from "./users.dto";

class UsersRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware());
        this.router.post('/changePassword', resetPassBodyDto, validationMiddleware, usersController.changePassword);
        this.router.get('/me', usersController.myInfo);
        this.router.get('/balance', usersController.myBalance);
        this.router.get('/users', usersController.getUsers);
    }
}

export default UsersRoute;
