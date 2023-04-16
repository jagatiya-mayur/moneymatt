import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { statusCode } from '../utils/globalConst';
import HttpException from '../exceptions/HttpException';

import { DataStoredInToken } from '../common/auth/auth.interface';
import userModel from '../common/users/users.model';
import env from '../configs/env.config';
import { User, UserDoc } from '../common/users/users.interface';
import { role } from "../utils/globalConst";
import { Socket } from 'socket.io';

interface SocketWithUser extends Socket {
    user?: UserDoc | null;
}

const socketAuthMiddleware = async (token: string, authenticateAdmin?: boolean) => {
    try {
        const Authorization = token.split('Bearer ')[1] || null;
        if (Authorization) {
            const secretKey: string = env.JWT_SECRET_KEY;
            const verificationResponse: DataStoredInToken = jwt.verify(Authorization, secretKey) as DataStoredInToken;
            const userId = verificationResponse.userId;

            const findUser: UserDoc | null = await userModel.findOne({
                _id: userId,
                isPhoneVerified: true
            });

            if (findUser) {
                if (authenticateAdmin && !(findUser.role == role.admin)) {
                    new HttpException(statusCode.UNAUTHORIZED, 'Unauthorized Access!');
                }
                return findUser;
            } else {
                new HttpException(statusCode.UNAUTHORIZED, 'Wrong authentication token!');
            }
        } else {
            new HttpException(statusCode.NOT_FOUND, 'Authentication token missing!');
        }
    }
    catch (error) {
        throw new HttpException(statusCode.UNAUTHORIZED, 'Unauthorized Access!');
    }
};

export default socketAuthMiddleware;
