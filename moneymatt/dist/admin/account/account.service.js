"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_model_1 = __importDefault(require("./account.model"));
let instance = null;
class AccountService {
    constructor() {
        this.account = account_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new AccountService();
        }
        return instance;
    }
    async createAccount(accountInfo) {
        return this.account.create(Object.assign({}, accountInfo));
    }
    async getAccount() {
        const accountInfo = await this.account.findOne().lean();
        if (!accountInfo) {
            return await this.createAccount({});
        }
        return accountInfo;
    }
    async updateAccount(accountInfo) {
        return this.account.findOneAndUpdate({}, Object.assign({}, accountInfo), {
            new: true
        });
    }
}
exports.default = AccountService.getInstance();
//# sourceMappingURL=account.service.js.map