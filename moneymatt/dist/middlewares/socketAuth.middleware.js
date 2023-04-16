"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const globalConst_1 = require("../utils/globalConst");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const users_model_1 = __importDefault(require("../common/users/users.model"));
const env_config_1 = __importDefault(require("../configs/env.config"));
const globalConst_2 = require("../utils/globalConst");
const socketAuthMiddleware = async (token, authenticateAdmin) => {
    try {
        const Authorization = token.split('Bearer ')[1] || null;
        if (Authorization) {
            const secretKey = env_config_1.default.JWT_SECRET_KEY;
            const verificationResponse = jsonwebtoken_1.default.verify(Authorization, secretKey);
            const userId = verificationResponse.userId;
            const findUser = await users_model_1.default.findOne({
                _id: userId,
                isPhoneVerified: true
            });
            if (findUser) {
                if (authenticateAdmin && !(findUser.role == globalConst_2.role.admin)) {
                    new HttpException_1.default(globalConst_1.statusCode.UNAUTHORIZED, 'Unauthorized Access!');
                }
                return findUser;
            }
            else {
                new HttpException_1.default(globalConst_1.statusCode.UNAUTHORIZED, 'Wrong authentication token!');
            }
        }
        else {
            new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, 'Authentication token missing!');
        }
    }
    catch (error) {
        throw new HttpException_1.default(globalConst_1.statusCode.UNAUTHORIZED, 'Unauthorized Access!');
    }
};
exports.default = socketAuthMiddleware;
//# sourceMappingURL=socketAuth.middleware.js.map