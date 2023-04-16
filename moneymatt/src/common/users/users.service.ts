import { Types } from "mongoose";

import { role, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";

import userModel from "./users.model";
import { ResetPassBody, User, UserDoc } from "./users.interface";
import axios from "axios";
import env from "../../configs/env.config";
import referEarnAmountService from "../../admin/referEarnAmount/referEarnAmount.service";

let instance: null | UsersService = null;

class UsersService {
    private user = userModel;

    static getInstance(): UsersService {
        if (instance == null) {
            instance = new UsersService();
        }

        return instance;
    }

    public async createAccount(phone: string): Promise<User> {

        const foundUser: User | null = await this.user.findOne({
            phone: phone,
        }).lean();

        if (foundUser?.isPhoneVerified) {
            throw new HttpException(statusCode.CONFLICT, "Phone already taken!");
        }

        if (foundUser) {
            return foundUser;
        } else {
            const newUser: User = await this.user.create({
                phone
            });

            return newUser
        }
    }

    public async updateUser(userId: Types.ObjectId, data: any): Promise<UserDoc | null> {
        return await this.user.findOneAndUpdate(
            {
                _id: userId
            },
            {
                ...data
            },
            {
                new: true
            }
        );
    }

    public async getVerifiedUserById(userId: Types.ObjectId): Promise<UserDoc | null> {
        return await this.user.findOne(
            {
                _id: userId,
                isPhoneVerified: true
            }
        ).select({
            password: 0
        });
    }

    public async getVerfiedUserByPhone(phone: string): Promise<UserDoc | null> {
        return await this.user.findOne(
            {
                phone,
                isPhoneVerified: true
            }
        );
    }

    public async changePassword(user: UserDoc, newPassword: string): Promise<UserDoc> {
        user.password = newPassword;
        return await user.save();
    };

    public checkPassword(user: UserDoc, password: string): boolean {
        return user.comparePassword(password);
    }

    public async resetPassword(user: UserDoc, resetPassBody: ResetPassBody): Promise<void> {
        if (!this.checkPassword(user, resetPassBody.currentPassword)) {
            throw new HttpException(statusCode.UNAUTHORIZED, "Wrong password!");
        }

        await this.changePassword(user, resetPassBody.newPassword);

        return;
    }

    public async updateBalance(userId: Types.ObjectId, amount: number): Promise<User> {
        return await this.user.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $inc: {
                    balance: amount
                }
            },
            {
                new: true
            }
        ).lean();
    }

    public async userAddedFirstMoney(userId: Types.ObjectId): Promise<void> {
        await this.user.findOneAndUpdate(
            {
                _id: userId
            },
            {
                isFirstMoneyAdded: true
            }
        );
    }

    public async deductBalance(userId: Types.ObjectId, amount: number): Promise<User> {
        return await this.user.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $inc: {
                    balance: -amount
                }
            },
            {
                new: true
            }
        ).lean()
    }

    public async getUsers() {
        return await this.user.find(
            {
                isPhoneVerified: true,
                role: "user"
            }
        )
            .sort({ balance: -1 })
            .lean()
            .select("phone balance email createdAt");
    }

    public async userCount(): Promise<number> {
        return await this.user.find({ role: role.user, isPhoneVerified: true }).count();
    }

    public async getUserByReferalCode(referalCode: string): Promise<User> {
        return this.user.findOne({
            referalCode,
            isPhoneVerified: true
        }).lean();
    }

    public async getUserByPhone(phone: string): Promise<User> {
        const user: User = await this.user.findOne({
            phone
        }).lean();

        if (!user) {
            throw new HttpException(statusCode.NOT_FOUND, "User doens't exists!");
        }

        return user;
    }

    public async addReferalEarnMoney(userId: Types.ObjectId, amount: number): Promise<void> {

        await this.user.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $inc: {
                    balance: amount
                }
            }
        ).lean();
    }

    public async getBalanceByUserId(userId: Types.ObjectId): Promise<number> {
        const user: User | null = await this.user.findById(userId);

        if (!user) {
            throw new HttpException(statusCode.NOT_FOUND, "account not found!");
        }

        return user.balance;
    }
}

export default UsersService.getInstance();