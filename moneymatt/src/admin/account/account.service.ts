import { Types } from "mongoose";

import { otpType, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { shortCode } from "../../utils/utils";

import accouontModel from "./account.model";
import { Account } from "./account.interface";

let instance: null | AccountService = null;

class AccountService {
    public account = accouontModel;

    static getInstance(): AccountService {
        if (instance == null) {
            instance = new AccountService();
        }

        return instance;
    }

    public async createAccount(accountInfo: Account) {
        return this.account.create({
            ...accountInfo
        });
    }

    public async getAccount(): Promise<any> {
        const accountInfo: Account | null
            = await this.account.findOne().lean();

        if (!accountInfo) {
            return await this.createAccount({});
        }

        return accountInfo;
    }

    public async updateAccount(accountInfo: Account): Promise<any> {
        return this.account.findOneAndUpdate(
            {},
            {
                ...accountInfo
            },
            {
                new: true
            }
        );
    }

}

export default AccountService.getInstance();