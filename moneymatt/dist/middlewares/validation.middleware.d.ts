import { Request, Response, NextFunction } from "express";
declare const validationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default validationMiddleware;
