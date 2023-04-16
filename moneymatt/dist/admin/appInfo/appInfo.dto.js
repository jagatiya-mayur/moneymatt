"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appUploaderDto = void 0;
const express_validator_1 = require("express-validator");
exports.appUploaderDto = [
    (0, express_validator_1.check)('apk')
        .custom((value, { req }) => {
        if (req.files['apk']) {
            return true;
        }
        else {
            return false;
        }
    })
        .withMessage('Upload apk!'),
    (0, express_validator_1.check)('dmg')
        .optional()
        .custom((value, { req }) => {
        if (req.files['dmg']) {
            return true;
        }
        else {
            return false;
        }
    })
        .withMessage('Upload dmg!')
];
//# sourceMappingURL=appInfo.dto.js.map