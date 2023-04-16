"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const users_controller_1 = __importDefault(require("./users.controller"));
const users_dto_1 = require("./users.dto");
class UsersRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.post('/changePassword', users_dto_1.resetPassBodyDto, validation_middleware_1.default, users_controller_1.default.changePassword);
        this.router.get('/me', users_controller_1.default.myInfo);
        this.router.get('/balance', users_controller_1.default.myBalance);
        this.router.get('/users', users_controller_1.default.getUsers);
    }
}
exports.default = UsersRoute;
//# sourceMappingURL=users.routes.js.map