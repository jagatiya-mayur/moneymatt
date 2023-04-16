import { Document, Types } from "mongoose";
export interface Device {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    deviceId: string;
}
export interface DeviceDoc extends Document, Device {
    _id: Types.ObjectId;
}
