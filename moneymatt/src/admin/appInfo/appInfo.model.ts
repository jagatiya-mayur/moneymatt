import { model, Schema } from 'mongoose';
import { AppInfo, AppInfoDoc } from './appInfo.interface';


const appInfoSchema: Schema = new Schema<AppInfo>(
    {
        version: { type: String, default: null },
        apkFile: { type: String, default: null },
        dmgFile: { type: String, default: null }
    }
);

const appInfoModel = model<AppInfoDoc>('appInfo', appInfoSchema);

export default appInfoModel;
