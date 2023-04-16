import { Request, Response, NextFunction, response } from "express";
import https from "https";
import { genchecksumbystring } from "../../utils/checksum";
import { Types } from "mongoose";

import { paymentStatus, statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import { RequestWithUser } from "../../common/auth/auth.interface";
import { User } from "../../common/users/users.interface";
import paymentService from "./payment.service";
import { PaymentBody, TransactionDoc, VerifyPaymentBody } from "./payment.interface";
import usersService from "../../common/users/users.service";
import referEarnAmountService from "../../admin/referEarnAmount/referEarnAmount.service";
import referalsService from "../../common/referals/referals.service";


let instance: null | PaymentController = null;

class PaymentController {

    static getInstance(): PaymentController {
        if (instance == null) {
            instance = new PaymentController();
        }
        return instance;
    }

    public getTransactionCharge(req: RequestWithUser, res: Response, next: NextFunction) {

        return res
            .status(statusCode.OK)
            .json(responseHandler({ charge: env.TRANSACTION_CHARGES! }, statusCode.OK, 'success'));
    }

    public async reqPayment(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const paymentBody: PaymentBody = req.body;

            const newPayment: any = await paymentService.newPayment(paymentBody, user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(newPayment, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async userPaymentHistory(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!

            const paymentHistory = await paymentService.getPaymentsByUserId(user._id!);

            return res
                .status(statusCode.OK)
                .json(responseHandler(paymentHistory, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async allUsersPaymentHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const allUsersHistory = await paymentService.getAllUserPayments();

            return res
                .status(statusCode.OK)
                .json(responseHandler(allUsersHistory, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const verifyPaymentBody: VerifyPaymentBody = req.body;

            const paymentInfo = await paymentService.verifyPayment(verifyPaymentBody);

            const user = await usersService.getVerifiedUserById(verifyPaymentBody.userId);

            // add money to referal accouont if added money is first time
            if (verifyPaymentBody.status == paymentStatus.success) {
                if (user?.isRefered && (user?.isFirstMoneyAdded === false)) {
                    const referalInfo = await referalsService.getReferalInfo(user._id);

                    if (referalInfo) {
                        await usersService.addReferalEarnMoney(referalInfo.referedBy, referalInfo.amount);
                    }

                    await usersService.userAddedFirstMoney(user._id);
                }
            }

            return res
                .status(statusCode.OK)
                .json(responseHandler(paymentInfo, statusCode.OK, 'success'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

}

export default PaymentController.getInstance();


