"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("bcrypt");
const globalConst_1 = require("../../utils/globalConst");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address!'],
        maxLength: 100,
    },
    name: { type: String },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Please fill a valid phone!"],
        unique: true,
        length: 10
    },
    password: { type: String },
    isPhoneVerified: { type: Boolean, default: false },
    role: { type: String, enum: globalConst_1.role, default: globalConst_1.role.user },
    balance: { type: Number, default: 50 },
    contactId: { type: String },
    referalCode: { type: String },
    active: { type: Boolean, default: true },
    isRefered: { type: Boolean, default: false },
    isFirstMoneyAdded: { type: Boolean, default: false }
}, {
    timestamps: true
});
userSchema.pre('save', function (next) {
    if (!!!this.isModified('password')) {
        return next();
    }
    this.password = (0, bcrypt_1.hashSync)(this.password, 10);
    next();
});
userSchema.methods.comparePassword = function (plainText) {
    return (0, bcrypt_1.compareSync)(plainText, this.password);
};
userSchema.index({ phone: 1, _id: 1 });
const UserModel = (0, mongoose_1.model)('user', userSchema);
exports.default = UserModel;
//# sourceMappingURL=users.model.js.map