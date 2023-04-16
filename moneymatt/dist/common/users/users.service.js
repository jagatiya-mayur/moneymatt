"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const users_model_1 = __importDefault(require("./users.model"));
let instance = null;
class UsersService {
    constructor() {
        this.user = users_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new UsersService();
        }
        return instance;
    }
    async createAccount(phone) {
        const foundUser = await this.user.findOne({
            phone: phone,
        }).lean();
        if (foundUser === null || foundUser === void 0 ? void 0 : foundUser.isPhoneVerified) {
            throw new HttpException_1.default(globalConst_1.statusCode.CONFLICT, "Phone already taken!");
        }
        if (foundUser) {
            return foundUser;
        }
        else {
            const newUser = await this.user.create({
                phone
            });
            return newUser;
        }
    }
    async updateUser(userId, data) {
        return await this.user.findOneAndUpdate({
            _id: userId
        }, Object.assign({}, data), {
            new: true
        });
    }
    async getVerifiedUserById(userId) {
        return await this.user.findOne({
            _id: userId,
            isPhoneVerified: true
        }).select({
            password: 0
        });
    }
    async getVerfiedUserByPhone(phone) {
        return await this.user.findOne({
            phone,
            isPhoneVerified: true
        });
    }
    async changePassword(user, newPassword) {
        user.password = newPassword;
        return await user.save();
    }
    ;
    checkPassword(user, password) {
        return user.comparePassword(password);
    }
    async resetPassword(user, resetPassBody) {
        if (!this.checkPassword(user, resetPassBody.currentPassword)) {
            throw new HttpException_1.default(globalConst_1.statusCode.UNAUTHORIZED, "Wrong password!");
        }
        await this.changePassword(user, resetPassBody.newPassword);
        return;
    }
    async updateBalance(userId, amount) {
        return await this.user.findOneAndUpdate({
            _id: userId
        }, {
            $inc: {
                balance: amount
            }
        }, {
            new: true
        }).lean();
    }
    async userAddedFirstMoney(userId) {
        await this.user.findOneAndUpdate({
            _id: userId
        }, {
            isFirstMoneyAdded: true
        });
    }
    async deductBalance(userId, amount) {
        return await this.user.findOneAndUpdate({
            _id: userId
        }, {
            $inc: {
                balance: -amount
            }
        }, {
            new: true
        }).lean();
    }
    async getUsers() {
        return await this.user.find({
            isPhoneVerified: true,
            role: "user"
        })
            .sort({ balance: -1 })
            .lean()
            .select("phone balance email createdAt");
    }
    async userCount() {
        return await this.user.find({ role: globalConst_1.role.user, isPhoneVerified: true }).count();
    }
    async getUserByReferalCode(referalCode) {
        return this.user.findOne({
            referalCode,
            isPhoneVerified: true
        }).lean();
    }
    async getUserByPhone(phone) {
        const user = await this.user.findOne({
            phone
        }).lean();
        if (!user) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "User doens't exists!");
        }
        return user;
    }
    async addReferalEarnMoney(userId, amount) {
        await this.user.findOneAndUpdate({
            _id: userId
        }, {
            $inc: {
                balance: amount
            }
        }).lean();
    }
    async getBalanceByUserId(userId) {
        const user = await this.user.findById(userId);
        if (!user) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "account not found!");
        }
        return user.balance;
    }
}
exports.default = UsersService.getInstance();
//# sourceMappingURL=users.service.js.map