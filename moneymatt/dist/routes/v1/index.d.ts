import Route from "../../common/interface/routes.interface";
declare class V1Routes implements Route {
    router: import("express-serve-static-core").Router;
    constructor();
    private initializeRoutes;
}
export default V1Routes;
