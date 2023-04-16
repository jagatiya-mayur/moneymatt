"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const referals_controller_1 = __importDefault(require("./referals.controller"));
const referals_dto_1 = require("./referals.dto");
class ReferalsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', referals_dto_1.queryDto, validation_middleware_1.default, referals_controller_1.default.getUserReferalsInfo);
        this.router.use((0, auth_middleware_1.default)());
        this.router.get('/status', referals_controller_1.default.getReferedUserStatus);
    }
}
exports.default = ReferalsRoute;
//# sourceMappingURL=referals.routes.js.map