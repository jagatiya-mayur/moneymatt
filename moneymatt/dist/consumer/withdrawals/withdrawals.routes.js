"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const withdrawals_controller_1 = __importDefault(require("./withdrawals.controller"));
const withdrawals_dto_1 = require("./withdrawals.dto");
class WithrawalsRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/all', (0, auth_middleware_1.default)(true), withdrawals_controller_1.default.allUsersWithdrawHistory);
        this.router.post('/verify', (0, auth_middleware_1.default)(true), withdrawals_dto_1.verifyWithraw, validation_middleware_1.default, withdrawals_controller_1.default.verifyWithdraw);
        this.router.use((0, auth_middleware_1.default)());
        this.router.post('/reqWithdraw', withdrawals_dto_1.withdrawBodyDto, validation_middleware_1.default, withdrawals_controller_1.default.reqWithdraw);
        this.router.get('/', withdrawals_controller_1.default.userWithdrawHistory);
    }
}
exports.default = WithrawalsRoute;
//# sourceMappingURL=withdrawals.routes.js.map