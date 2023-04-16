import { Types } from "mongoose";
declare class QueriesService {
    private query;
    static getInstance(): QueriesService;
    newQuery(queryBody: any, userId: Types.ObjectId): Promise<any>;
    userQueries(userId: Types.ObjectId): Promise<any>;
    getAllQuereis(): Promise<any>;
    queryStatusUpdate(queryId: Types.ObjectId): Promise<any>;
}
declare const _default: QueriesService;
export default _default;
