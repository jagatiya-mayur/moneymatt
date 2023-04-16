"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const results_controller_1 = __importDefault(require("./results.controller"));
const results_dto_1 = require("./results.dto");
class ResultsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.get('/all', results_controller_1.default.getAllResults);
        this.router.get('/', results_dto_1.resultQueryDto, validation_middleware_1.default, results_controller_1.default.getResults);
        this.router.get('/currentPeriod', results_controller_1.default.currentPeriod);
        this.router.post('/setResult', results_dto_1.setResultBodyDto, validation_middleware_1.default, results_controller_1.default.setResult);
        this.router.get('/currentResult', results_controller_1.default.getCurrentEstimatedResult);
        this.router.get('/dashboardData', results_controller_1.default.getDashBoardData);
        this.router.get('/deleteResults', results_controller_1.default.deleteResults);
    }
}
exports.default = ResultsRoute;
//# sourceMappingURL=results.routes.js.map