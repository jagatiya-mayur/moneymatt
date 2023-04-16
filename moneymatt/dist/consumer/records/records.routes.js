"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const records_controller_1 = __importDefault(require("./records.controller"));
const records_dto_1 = require("./records.dto");
class RecordsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.get('/', records_dto_1.recordQueryDto, validation_middleware_1.default, records_controller_1.default.myRecord);
        this.router.post('/newRecord', records_dto_1.newRecordBodyDto, validation_middleware_1.default, records_controller_1.default.newRecord);
    }
}
exports.default = RecordsRoute;
//# sourceMappingURL=records.routes.js.map