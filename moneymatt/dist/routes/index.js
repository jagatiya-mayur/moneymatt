"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = __importDefault(require("./v1"));
class Routes {
    constructor() {
        this.path = "/v1";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(this.path, new v1_1.default().router);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map