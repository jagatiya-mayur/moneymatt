import { Types } from "mongoose";
import { Device } from "./devices.interface";
declare class AuthService {
    private device;
    static getInstance(): AuthService;
    findDeviceId(userId: Types.ObjectId, deviceId: string): Promise<Device | null>;
    addDeviceId(userId: Types.ObjectId, deviceId: string): Promise<any>;
}
declare const _default: AuthService;
export default _default;
