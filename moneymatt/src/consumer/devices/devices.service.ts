
import { Types } from "mongoose";

import HttpException from "../../exceptions/HttpException";

import { Device } from "./devices.interface";
import deviceModel from "./devices.model";

let instance: null | AuthService = null;

class AuthService {
    private device = deviceModel;

    static getInstance(): AuthService {
        if (instance == null) {
            instance = new AuthService();
        }

        return instance;
    }

    public async findDeviceId(userId: Types.ObjectId, deviceId: string): Promise<Device | null> {
        return await this.device.findOne({
            user: userId,
            deviceId
        }).lean();
    }

    public async addDeviceId(userId: Types.ObjectId, deviceId: string): Promise<any> {
        await this.device.create({
            user: userId,
            deviceId
        });

        return;
    }
}

export default AuthService.getInstance();