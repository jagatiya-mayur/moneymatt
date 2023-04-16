"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const queries_model_1 = __importDefault(require("./queries.model"));
let instance = null;
class QueriesService {
    constructor() {
        this.query = queries_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new QueriesService();
        }
        return instance;
    }
    async newQuery(queryBody, userId) {
        return await this.query.create(Object.assign(Object.assign({}, queryBody), { user: userId }));
    }
    async userQueries(userId) {
        return await this.query.find({
            user: userId
        })
            .sort({
            createdAt: -1
        })
            .lean()
            .select("email phone query status createdAt");
    }
    async getAllQuereis() {
        const pendingQueries = await this.query.find({
            status: globalConst_1.queryStatus.pending
        })
            .lean()
            .sort({ createdAt: -1 })
            .select("email phone query status createdAt");
        const resolvedQueries = await this.query.find({
            status: globalConst_1.queryStatus.resolved
        })
            .lean()
            .sort({ createdAt: -1 })
            .select("email phone query status createdAt");
        return [
            ...pendingQueries,
            ...resolvedQueries
        ];
    }
    async queryStatusUpdate(queryId) {
        const queryInfo = await this.query.findOne({
            _id: queryId,
        }).lean();
        if (!queryInfo) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Query doesn't exists!");
        }
        if (queryInfo.status == globalConst_1.queryStatus.resolved) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Query already Solved!");
        }
        return await this.query.findByIdAndUpdate(queryId, {
            status: globalConst_1.queryStatus.resolved
        }, {
            new: true
        });
    }
}
exports.default = QueriesService.getInstance();
//# sourceMappingURL=queries.service.js.map