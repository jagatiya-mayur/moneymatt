"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const referEarnAmount_controller_1 = __importDefault(require("./referEarnAmount.controller"));
const referEarnAmount_dto_1 = require("./referEarnAmount.dto");
class ReferEarnAmountRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', referEarnAmount_controller_1.default.getReferEarnAmount);
        this.router.patch('/', referEarnAmount_dto_1.amountsDto, validation_middleware_1.default, referEarnAmount_controller_1.default.updateReferEarnAmount);
    }
}
exports.default = ReferEarnAmountRoutes;
//# sourceMappingURL=referEarnAmount.routes.js.map