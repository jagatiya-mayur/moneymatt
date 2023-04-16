"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devices_model_1 = __importDefault(require("./devices.model"));
let instance = null;
class AuthService {
    constructor() {
        this.device = devices_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new AuthService();
        }
        return instance;
    }
    async findDeviceId(userId, deviceId) {
        return await this.device.findOne({
            user: userId,
            deviceId
        }).lean();
    }
    async addDeviceId(userId, deviceId) {
        await this.device.create({
            user: userId,
            deviceId
        });
        return;
    }
}
exports.default = AuthService.getInstance();
//# sourceMappingURL=devices.service.js.map