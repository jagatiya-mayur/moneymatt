"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const yantraResults_controller_1 = __importDefault(require("./yantraResults.controller"));
const yantraResults_dto_1 = require("./yantraResults.dto");
class YantraResultsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.get('/all', yantraResults_controller_1.default.getAllResults);
        this.router.get('/', yantraResults_dto_1.resultQueryDto, validation_middleware_1.default, yantraResults_controller_1.default.getResults);
        this.router.get('/currentPeriod', yantraResults_controller_1.default.currentPeriod);
        this.router.post('/setResult', yantraResults_dto_1.setResultBodyDto, validation_middleware_1.default, yantraResults_controller_1.default.setResult);
        this.router.get('/currentResult', yantraResults_controller_1.default.getCurrentEstimatedResult);
        this.router.get('/dashboardData', yantraResults_controller_1.default.getDashBoardData);
        this.router.get('/deleteResults', yantraResults_controller_1.default.deleteResults);
    }
}
exports.default = YantraResultsRoute;
//# sourceMappingURL=yantraResults.routes.js.map