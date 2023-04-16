/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Types } from "mongoose";
import { ResetPassBody, User, UserDoc } from "./users.interface";
declare class UsersService {
    private user;
    static getInstance(): UsersService;
    createAccount(phone: string): Promise<User>;
    updateUser(userId: Types.ObjectId, data: any): Promise<UserDoc | null>;
    getVerifiedUserById(userId: Types.ObjectId): Promise<UserDoc | null>;
    getVerfiedUserByPhone(phone: string): Promise<UserDoc | null>;
    changePassword(user: UserDoc, newPassword: string): Promise<UserDoc>;
    checkPassword(user: UserDoc, password: string): boolean;
    resetPassword(user: UserDoc, resetPassBody: ResetPassBody): Promise<void>;
    updateBalance(userId: Types.ObjectId, amount: number): Promise<User>;
    userAddedFirstMoney(userId: Types.ObjectId): Promise<void>;
    deductBalance(userId: Types.ObjectId, amount: number): Promise<User>;
    getUsers(): Promise<import("mongoose").LeanDocument<UserDoc & Required<{
        _id: Types.ObjectId;
    }>>[]>;
    userCount(): Promise<number>;
    getUserByReferalCode(referalCode: string): Promise<User>;
    getUserByPhone(phone: string): Promise<User>;
    addReferalEarnMoney(userId: Types.ObjectId, amount: number): Promise<void>;
    getBalanceByUserId(userId: Types.ObjectId): Promise<number>;
}
declare const _default: UsersService;
export default _default;
