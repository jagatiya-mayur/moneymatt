"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const pricePercentage_controller_1 = __importDefault(require("./pricePercentage.controller"));
const pricePercentage_dto_1 = require("./pricePercentage.dto");
class PricePercentageRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)(true));
        this.router.get('/', pricePercentage_controller_1.default.getPricePer);
        this.router.post('/', pricePercentage_dto_1.percentageDto, validation_middleware_1.default, pricePercentage_controller_1.default.updatePricePer);
    }
}
exports.default = PricePercentageRoute;
//# sourceMappingURL=pricePercentage.routes.js.map