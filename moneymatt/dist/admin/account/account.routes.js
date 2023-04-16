"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const account_controller_1 = __importDefault(require("./account.controller"));
const uploader_1 = require("../../utils/uploader");
const account_dto_1 = require("./account.dto");
class AccountRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router
            .route('/')
            .get(account_controller_1.default.getAccount)
            .patch(uploader_1.qrCode.single('upiQrCode'), account_dto_1.accountBodyDto, validation_middleware_1.default, account_controller_1.default.updateAccount);
    }
}
exports.default = AccountRoute;
//# sourceMappingURL=account.routes.js.map