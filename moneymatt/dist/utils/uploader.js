"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.qrCode = void 0;
const multer_1 = __importStar(require("multer"));
const fs_1 = __importDefault(require("fs"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const isValidTypeImage = (file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        return cb(new HttpException_1.default(413, file.fieldname + ' Only .png, .jpg and .jpeg format allowed!'));
    }
};
const imageParams = {
    fileFilter: (req, file, cb) => {
        isValidTypeImage(file, cb);
    },
    limits: { fileSize: 30 * 1024 * 1024 },
};
exports.qrCode = (0, multer_1.default)(Object.assign({ storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const dir = `upload`;
            fs_1.default.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, `upiQrCode.${ext}`);
        },
    }) }, imageParams));
exports.app = (0, multer_1.default)({
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const dir = `upload`;
            fs_1.default.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const fieldName = file.fieldname;
            cb(null, `${fieldName}-file.${fieldName}`);
        },
    }),
});
//# sourceMappingURL=uploader.js.map