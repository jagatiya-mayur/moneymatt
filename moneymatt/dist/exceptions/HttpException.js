"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
        this.hasError = true;
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map