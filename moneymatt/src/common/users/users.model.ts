import { model, Schema, Types } from 'mongoose';
import { hashSync, compareSync } from "bcrypt";

import { User, UserDoc } from "./users.interface";
import { role } from '../../utils/globalConst';

const userSchema: Schema = new Schema<User>(
    {
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
        role: { type: String, enum: role, default: role.user },
        balance: { type: Number, default: 50 },
        contactId: { type: String },
        referalCode: { type: String },
        active: { type: Boolean, default: true },
        isRefered: { type: Boolean, default: false },
        isFirstMoneyAdded: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

userSchema.pre<UserDoc>('save', function (next) {
    if (!!!this.isModified('password')) {
        return next();
    }
    this.password = hashSync(this.password!, 10);
    next();
});

userSchema.methods.comparePassword = function (plainText: string) {
    return compareSync(plainText, this.password);
};

userSchema.index({ phone: 1, _id: 1 });

const UserModel = model<UserDoc>('user', userSchema);

export default UserModel;
