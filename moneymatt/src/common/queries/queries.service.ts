import { Types } from "mongoose";
import { queryStatus, statusCode } from "../../utils/globalConst";

import HttpException from "../../exceptions/HttpException";

import QueryModel from "./queries.model";

let instance: null | QueriesService = null;

class QueriesService {
    private query = QueryModel;

    static getInstance(): QueriesService {
        if (instance == null) {
            instance = new QueriesService();
        }

        return instance;
    }

    public async newQuery(queryBody: any, userId: Types.ObjectId): Promise<any> {
        return await this.query.create({
            ...queryBody,
            user: userId
        });
    }

    public async userQueries(userId: Types.ObjectId): Promise<any> {
        return await this.query.find({
            user: userId
        })
            .sort({
                createdAt: -1
            })
            .lean()
            .select("email phone query status createdAt");
    }

    public async getAllQuereis(): Promise<any> {
        const pendingQueries = await this.query.find(
            {
                status: queryStatus.pending
            })
            .lean()
            .sort({ createdAt: -1 })
            .select("email phone query status createdAt");

        const resolvedQueries = await this.query.find(
            {
                status: queryStatus.resolved
            })
            .lean()
            .sort({ createdAt: -1 })
            .select("email phone query status createdAt");

        return [
            ...pendingQueries,
            ...resolvedQueries
        ]
    }

    public async queryStatusUpdate(queryId: Types.ObjectId): Promise<any> {
        const queryInfo: any = await this.query.findOne({
            _id: queryId,
        }).lean();

        if (!queryInfo) {
            throw new HttpException(statusCode.NOT_FOUND, "Query doesn't exists!");
        }

        if (queryInfo.status == queryStatus.resolved) {
            throw new HttpException(statusCode.NOT_FOUND, "Query already Solved!");
        }

        return await this.query.findByIdAndUpdate(
            queryId,
            {
                status: queryStatus.resolved
            },
            {
                new: true
            }
        );
    }
}

export default QueriesService.getInstance();