"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const payment_controller_1 = __importDefault(require("./payment.controller"));
const payment_dto_1 = require("./payment.dto");
class PaymentRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/all', (0, auth_middleware_1.default)(true), payment_controller_1.default.allUsersPaymentHistory);
        this.router.post('/verify', (0, auth_middleware_1.default)(true), payment_dto_1.verifyPaymentDto, validation_middleware_1.default, payment_controller_1.default.verifyPayment);
        this.router.use((0, auth_middleware_1.default)());
        this.router.get('/', payment_controller_1.default.userPaymentHistory);
        this.router.get("/tnxCharge", payment_controller_1.default.getTransactionCharge);
        this.router.post("/reqPayment", payment_dto_1.reqPaymentDto, validation_middleware_1.default, payment_controller_1.default.reqPayment);
    }
}
exports.default = PaymentRoute;
//# sourceMappingURL=payment.routes.js.map