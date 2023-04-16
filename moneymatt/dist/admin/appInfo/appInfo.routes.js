"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const appInfo_controller_1 = __importDefault(require("./appInfo.controller"));
const uploader_1 = require("../../utils/uploader");
const appInfo_dto_1 = require("./appInfo.dto");
class AppInfoRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router
            .route('/')
            .post((0, auth_middleware_1.default)(true), uploader_1.app.fields([
            { name: "apk", maxCount: 1 },
            { name: "dmg", maxCount: 1 }
        ]), appInfo_dto_1.appUploaderDto, validation_middleware_1.default, appInfo_controller_1.default.updateAppInfo)
            .get(appInfo_controller_1.default.getAppInfo);
    }
}
exports.default = AppInfoRoute;
//# sourceMappingURL=appInfo.routes.js.map