import { Request } from 'express';
import multer, { diskStorage } from 'multer';
import fs from "fs";
import HttpException from '../exceptions/HttpException';

const isValidTypeImage = (file: Express.Multer.File, cb: Function) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        return cb(
            new HttpException(413, file.fieldname + ' Only .png, .jpg and .jpeg format allowed!'),
        );
    }
};

const imageParams = {
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
        isValidTypeImage(file, cb);
    },
    limits: { fileSize: 30 * 1024 * 1024 },
};

export const qrCode = multer({
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = `upload`;
            fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, `upiQrCode.${ext}`)
        },
    }),
    ...imageParams,
});

export const app = multer({
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = `upload`;
            fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const fieldName = file.fieldname;
            cb(null, `${fieldName}-file.${fieldName}`)
        },
    }),
});

