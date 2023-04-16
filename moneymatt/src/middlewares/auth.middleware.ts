import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { statusCode } from '../utils/globalConst';
import HttpException from '../exceptions/HttpException';

import { DataStoredInToken, RequestWithUser } from '../common/auth/auth.interface';
import userModel from '../common/users/users.model';
import env from '../configs/env.config';
import { User, UserDoc } from '../common/users/users.interface';
import { role } from "../utils/globalConst";

const authMiddleware = (authenticateAdmin?: boolean) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const Authorization = req.get('Authorization')?.split('Bearer ')[1] || null;
            if (Authorization) {
                const secretKey: string = env.JWT_SECRET_KEY;
                const verificationResponse: DataStoredInToken = jwt.verify(Authorization, secretKey) as DataStoredInToken;
                const userId = verificationResponse.userId;

                const findUser: UserDoc | null = await userModel.findOne({
                    _id: userId,
                    isPhoneVerified: true
                });

                if (findUser) {
                    req.user = findUser;
                    if (authenticateAdmin && !(findUser.role == role.admin)) {
                        next(new HttpException(statusCode.UNAUTHORIZED, 'Unauthorized Access!'));
                    }
                    next();
                } else {
                    next(new HttpException(statusCode.UNAUTHORIZED, 'Wrong authentication token!'));
                }
            } else {
                next(new HttpException(statusCode.NOT_FOUND, 'Authentication token missing!'));
            }
        } catch (error) {
            next(new HttpException(statusCode.NOT_FOUND, 'Wrong authentication token!'));
        }
    };
};

export default authMiddleware;
