"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const queries_service_1 = __importDefault(require("./queries.service"));
let instance = null;
class ResultsController {
    static getInstance() {
        if (instance == null) {
            instance = new ResultsController();
        }
        return instance;
    }
    async newQuery(req, res, next) {
        try {
            const user = req.user;
            const queryData = req.body;
            const newQueryDoc = await queries_service_1.default.newQuery(queryData, user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newQueryDoc, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getUserQueries(req, res, next) {
        try {
            const user = req.user;
            const queries = await queries_service_1.default.userQueries(user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(queries, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getQueries(req, res, next) {
        try {
            const user = req.user;
            const queries = await queries_service_1.default.userQueries(user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(queries, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getAllQueries(req, res, next) {
        try {
            const quereis = await queries_service_1.default.getAllQuereis();
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(quereis, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateQueryStatus(req, res, next) {
        try {
            const { queryId } = req.query;
            const updatedQuery = await queries_service_1.default.queryStatusUpdate(queryId);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(updatedQuery, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = ResultsController.getInstance();
//# sourceMappingURL=queries.controller.js.map