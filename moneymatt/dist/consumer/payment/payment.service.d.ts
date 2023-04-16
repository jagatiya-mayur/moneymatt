import { Types } from "mongoose";
import { PaymentBody, VerifyPaymentBody } from "./payment.interface";
declare class PaymentService {
    private transaction;
    static getInstance(): PaymentService;
    newPayment(paymentBody: PaymentBody, userId: Types.ObjectId): Promise<any>;
    getPaymentByReferenceId(referenceId: string): Promise<any>;
    getPaymentsByUserId(userId: Types.ObjectId): Promise<any>;
    getAllUserPayments(): Promise<any>;
    verifyPayment(verifyPaymentBody: VerifyPaymentBody): Promise<any>;
}
declare const _default: PaymentService;
export default _default;
