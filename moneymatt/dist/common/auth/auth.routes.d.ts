import Route from "../interface/routes.interface";
declare class AuthRoute implements Route {
    router: import("express-serve-static-core").Router;
    constructor();
    private initializeRoutes;
}
export default AuthRoute;
