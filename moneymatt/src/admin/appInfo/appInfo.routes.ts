import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import Route from "../../common/interface/routes.interface";

import appInfoController from "./appInfo.controller";
import { app } from "../../utils/uploader";
import { appUploaderDto } from "./appInfo.dto";

class AppInfoRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .route('/')
            .post(
                authMiddleware(true),
                app.fields([
                    { name: "apk", maxCount: 1 },
                    { name: "dmg", maxCount: 1 }
                ]),
                appUploaderDto, validationMiddleware, appInfoController.updateAppInfo)
            .get(appInfoController.getAppInfo);
    }
}

export default AppInfoRoute;
