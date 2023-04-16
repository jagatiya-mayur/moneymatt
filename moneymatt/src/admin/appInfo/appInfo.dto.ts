import { check } from 'express-validator';

export const appUploaderDto = [
    // body('version').isString().withMessage('Invalid version!'),

    check('apk')
        .custom((value, { req }) => {
            if (req.files['apk']) {
                return true; // return "non-falsy" value to indicate valid data"
            } else {
                return false; // return "falsy" value to indicate invalid data
            }
        })
        .withMessage('Upload apk!'),

    check('dmg')
        .optional()
        .custom((value, { req }) => {
            if (req.files['dmg']) {
                return true; // return "non-falsy" value to indicate valid data"
            } else {
                return false; // return "falsy" value to indicate invalid data
            }
        })
        .withMessage('Upload dmg!')
];
