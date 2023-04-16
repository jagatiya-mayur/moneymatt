"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const queries_controller_1 = __importDefault(require("./queries.controller"));
const queries_dto_1 = require("./queries.dto");
class QueriesRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.post("/", queries_dto_1.newQueryDto, validation_middleware_1.default, queries_controller_1.default.newQuery);
        this.router.get("/", queries_controller_1.default.getUserQueries);
        this.router.get("/all", queries_controller_1.default.getAllQueries);
        this.router.patch("/status", queries_controller_1.default.updateQueryStatus);
    }
}
exports.default = QueriesRoute;
//# sourceMappingURL=queries.routes.js.map