"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = __importStar(require("node-cron"));
const utils_1 = require("../utils/utils");
const results_service_1 = __importDefault(require("../common/results/results.service"));
const yantraResults_service_1 = __importDefault(require("../common/yantraResults/yantraResults.service"));
const logger_1 = require("../utils/logger");
cron.schedule("*/3 * * * *", async () => {
    try {
        setImmediate(async () => {
            const date = new Date();
            const period = (0, utils_1.getPeriod)(date);
            await results_service_1.default.initializeResult(period, date);
            setTimeout(async () => {
                await results_service_1.default.resultDeclaration(period);
            }, 170 * 1000);
            const nextDate = new Date(date.getTime() + 180 * 1000);
            const nextPeriod = (0, utils_1.getPeriod)(nextDate);
            await results_service_1.default.initializeFutureResult(nextPeriod, date);
            logger_1.logger.info(`[Initialized Result Executed Successfully] ===> Activity Cron`);
        });
    }
    catch (error) {
        console.log(error);
        logger_1.logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});
cron.schedule("0 0 * * *", async () => {
    try {
        await results_service_1.default.deleteResults();
        logger_1.logger.info(`[Initialized Delete Result Executed Successfully] ===> Activity Cron`);
    }
    catch (error) {
        console.log(error);
        logger_1.logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});
cron.schedule("*/5 * * * *", async () => {
    try {
        setImmediate(async () => {
            const date = new Date();
            const period = (0, utils_1.getYantraPeriod)(date);
            await yantraResults_service_1.default.initializeResult(period, date);
            setTimeout(async () => {
                await yantraResults_service_1.default.resultDeclaration(period);
            }, 290 * 1000);
            const nextDate = new Date(date.getTime() + 300 * 1000);
            const nextPeriod = (0, utils_1.getYantraPeriod)(nextDate);
            await yantraResults_service_1.default.initializeFutureResult(nextPeriod, date);
            logger_1.logger.info(`[Initialized Result Executed Successfully] ===> Activity yantra Cron`);
        });
    }
    catch (error) {
        console.log(error);
        logger_1.logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});
cron.schedule("0 0 * * *", async () => {
    try {
        await yantraResults_service_1.default.deleteResults();
        logger_1.logger.info(`[Initialized Delete Result Executed Successfully] ===> Activity yantra Cron`);
    }
    catch (error) {
        console.log(error);
        logger_1.logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});
//# sourceMappingURL=results.cron.js.map