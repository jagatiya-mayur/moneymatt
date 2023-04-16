import { Document, Types } from "mongoose";
import { User } from "../../common/users/users.interface";

export interface Device {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    deviceId: string;
}

export interface DeviceDoc extends Document, Device {
    _id: Types.ObjectId
}