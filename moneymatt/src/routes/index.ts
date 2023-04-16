import { Router } from "express";
import Route from "../common/interface/routes.interface";
import V1Routes from "./v1";

class Routes implements Route {
    public path: string = "/v1";
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(this.path, new V1Routes().router);
    }
}

export default Routes;  