"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const yantraResults_service_1 = __importDefault(require("./yantraResults.service"));
let instance = null;
class YantraResultsController {
    static getInstance() {
        if (instance == null) {
            instance = new YantraResultsController();
        }
        return instance;
    }
    async currentPeriod(req, res, next) {
        try {
            const periodInfo = await yantraResults_service_1.default.currentPeriod();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(periodInfo, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
        }
    }
    async getResults(req, res, next) {
        try {
            const resultGetQuey = req.query;
            const results = await yantraResults_service_1.default.getResults(resultGetQuey);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(results, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getAllResults(req, res, next) {
        try {
            const results = await yantraResults_service_1.default.getAllResults();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(results, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async setResult(req, res, next) {
        try {
            const setResultBody = req.body;
            await yantraResults_service_1.default.setResult(setResultBody);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getCurrentEstimatedResult(req, res, next) {
        try {
            const { period } = req.query;
            const resultInfo = await yantraResults_service_1.default.getCurrentResult(period);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(resultInfo, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getDashBoardData(req, res, next) {
        try {
            const deshboardData = await yantraResults_service_1.default.getDashBoardData();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(deshboardData, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async deleteResults(req, res, next) {
        try {
            await yantraResults_service_1.default.deleteResults();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = YantraResultsController.getInstance();
//# sourceMappingURL=yantraResults.controller.js.map