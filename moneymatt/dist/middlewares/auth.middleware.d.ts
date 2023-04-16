import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../common/auth/auth.interface';
declare const authMiddleware: (authenticateAdmin?: boolean) => (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export default authMiddleware;
