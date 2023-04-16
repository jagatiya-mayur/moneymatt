"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const yantraRecords_controller_1 = __importDefault(require("./yantraRecords.controller"));
const yantraRecords_dto_1 = require("./yantraRecords.dto");
class YantraRecordsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.get('/', yantraRecords_dto_1.recordQueryDto, validation_middleware_1.default, yantraRecords_controller_1.default.myRecord);
        this.router.post('/newRecord', yantraRecords_dto_1.newRecordBodyDto, validation_middleware_1.default, yantraRecords_controller_1.default.newRecord);
    }
}
exports.default = YantraRecordsRoute;
//# sourceMappingURL=yantraRecords.routes.js.map