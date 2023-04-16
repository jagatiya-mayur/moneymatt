import { Types } from "mongoose";
import { Referal } from "./referals.interface";
declare class ReferalService {
    private referal;
    static getInstance(): ReferalService;
    validateReferalCode(referalCode: string): Promise<Types.ObjectId>;
    addReferal(referedTo: Types.ObjectId, referedBy: Types.ObjectId): Promise<void>;
    userReferalsInfo(phone: string): Promise<any>;
    getUsersReferalsUserId(userId: Types.ObjectId): Promise<Array<Types.ObjectId>>;
    referedUserStatus(userId: Types.ObjectId): Promise<any>;
    getReferencingUserByUserId(userId: Types.ObjectId): Promise<Types.ObjectId>;
    getReferalInfo(referedTo: Types.ObjectId): Promise<Referal>;
}
declare const _default: ReferalService;
export default _default;
