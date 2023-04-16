import { Router } from "express";
import Route from "../common/interface/routes.interface";
declare class Routes implements Route {
    path: string;
    router: Router;
    constructor();
    private initializeRoutes;
}
export default Routes;
