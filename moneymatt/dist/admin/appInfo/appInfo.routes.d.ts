import Route from "../../common/interface/routes.interface";
declare class AppInfoRoute implements Route {
    router: import("express-serve-static-core").Router;
    constructor();
    private initializeRoutes;
}
export default AppInfoRoute;
