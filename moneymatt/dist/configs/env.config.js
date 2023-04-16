"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const path_1 = require("path");
const dotenv_1 = require("dotenv");
let envPath;
if (process.env.NODE_ENV === 'development') {
    envPath = (0, path_1.resolve)(process.cwd(), '.env');
}
else if (process.env.NODE_ENV === 'stage') {
    envPath = (0, path_1.resolve)(process.cwd(), '.env');
}
else if (process.env.NODE_ENV === 'production') {
    envPath = (0, path_1.resolve)(process.cwd(), '.env');
}
else {
    envPath = (0, path_1.resolve)(process.cwd(), '.env');
}
(0, dotenv_1.config)({ path: envPath });
const envVarsSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().allow('development', 'production', 'stage').default('developmenet'),
    PORT: joi_1.default.number().default(3000),
    MONGO_URL: joi_1.default.string().required(),
    JWT_SECRET_KEY: joi_1.default.string().required(),
    FAST2SMS_AUTHORIZATION_KEY: joi_1.default.string().required(),
    TRANSACTION_CHARGES: joi_1.default.number().required()
})
    .unknown()
    .required();
const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
    console.log('\n envVars', envVars);
    throw new Error(`Config validation error: ${error.message}`);
}
const env = {
    NODE_ENV: envVars.NODE_ENV,
    PORT: envVars.PORT,
    MONGO_URL: envVars.MONGO_URL,
    JWT_SECRET_KEY: envVars.JWT_SECRET_KEY,
    FAST2SMS_AUTHORIZATION_KEY: envVars.FAST2SMS_AUTHORIZATION_KEY,
    TRANSACTION_CHARGES: envVars.TRANSACTION_CHARGES
};
exports.default = env;
//# sourceMappingURL=env.config.js.map