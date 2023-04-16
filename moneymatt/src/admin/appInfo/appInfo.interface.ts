import { Types, Document } from "mongoose";

export interface AppInfo {
    _id?: Types.ObjectId;
    version: string;
    apkFile: string;
    dmgFile: string;
}

export interface AppInfoDoc extends AppInfo, Document {
    _id: Types.ObjectId;
}