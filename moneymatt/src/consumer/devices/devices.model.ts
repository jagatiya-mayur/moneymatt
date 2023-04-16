import { model, Schema } from 'mongoose';

import { Device, DeviceDoc } from './devices.interface';

const deviceSchema: Schema = new Schema<Device>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        deviceId: { type: String, required: true, trim: true }
    }
);

const DeviceModel = model<DeviceDoc>('device', deviceSchema);

export default DeviceModel;
