import { Types } from "mongoose";
import { createHmac } from "crypto";

import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";
import { paymentStatus, statusCode, transactionStatus } from "../../utils/globalConst";

import transactionModel from "./payment.model";
import usersService from "../../common//users/users.service"
import { PaymentBody, Transaction, TransactionDoc, VerifyPaymentBody } from "./payment.interface";
import { deduct2Per, stringToNumber, twoPerOfValue } from "../../utils/utils";
import { User } from "../../common/users/users.interface";
import referalsService from "../../common/referals/referals.service";

let instance: null | PaymentService = null;

class PaymentService {
    private transaction = transactionModel

    static getInstance(): PaymentService {
        if (instance == null) {
            instance = new PaymentService();
        }

        return instance;
    }

    public async newPayment(paymentBody: PaymentBody, userId: Types.ObjectId): Promise<any> {
        const payment = await this.getPaymentByReferenceId(paymentBody.referenceId);

        if (payment) {
            throw new HttpException(statusCode.CONFLICT, "referenceId already exists!");
        }

        return await this.transaction.create(
            {
                user: userId,
                ...paymentBody,
                fee: (env.TRANSACTION_CHARGES * paymentBody.amount) / 100
            }
        );
    }

    public async getPaymentByReferenceId(referenceId: string): Promise<any> {
        return this.transaction.findOne({ referenceId }).lean();
    }

    public async getPaymentsByUserId(userId: Types.ObjectId): Promise<any> {
        return await this.transaction.find(
            {
                user: userId
            },
            {
                referenceId: 1,
                date: 1,
                amount: 1,
                fee: 1,
                status: 1
            }
        ).sort({ createdAt: -1 });
    }

    public async getAllUserPayments(): Promise<any> {
        return await this.transaction.find(
            {
                status: paymentStatus.pending
            },
            {
                referenceId: 1,
                date: 1,
                amount: 1,
                fee: 1,
                status: 1,
                user: 1
            }
        )
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "phone email name"
            });;
    }

    public async verifyPayment(verifyPaymentBody: VerifyPaymentBody): Promise<any> {
        const { paymentId, status, userId } = verifyPaymentBody;
        const paymentInfo: Transaction | null = await this.transaction.findOneAndUpdate(
            {
                _id: paymentId,
                user: userId,
                status: paymentStatus.pending
            },
            {
                status
            },
            {
                new: true
            }
        );

        if (!paymentInfo) {
            throw new HttpException(statusCode.NOT_FOUND, "Transaction already verified!");
        }

        if (paymentInfo && paymentInfo.status === paymentStatus.success) {
            const amount = paymentInfo.amount - paymentInfo.fee;
            await usersService.updateBalance(userId, amount);
        }

        return paymentInfo;
    }
}

export default PaymentService.getInstance();