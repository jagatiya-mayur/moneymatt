import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Something went wrong';

        logger.error(`[${req.method}] ${req.path} ===> StatusCode:: ${status}, Message:: ${message}, \n Stack:: ${error.stack || 'something went wrong'}`);

        return res.status(status).json({ statusCode: status, hasError: true, message, stack: error.stack || "something went wrong" });

    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
