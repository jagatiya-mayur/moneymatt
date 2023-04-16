import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";

import HttpException from '../exceptions/HttpException';

const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = errors['errors'].map((error: any) => {
            return error["msg"];
        });
        return next(new HttpException(400, error.join(", ")))
    }
    next()
};

export default validationMiddleware;
