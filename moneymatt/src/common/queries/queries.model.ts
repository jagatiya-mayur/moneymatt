import { model, Schema } from 'mongoose';
import { queryStatus } from '../../utils/globalConst';

import { Query, QueryDoc } from "./queries.interface";

const querySchema: Schema = new Schema<Query>(
    {
        user: { type: Schema.Types.ObjectId, required: true, red: "user" },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        query: { type: String, required: true },
        status: { type: String, enum: queryStatus, default: queryStatus.pending }
    },
    {
        timestamps: true
    }
);

const QueryModel = model<QueryDoc>('query', querySchema);

export default QueryModel;
