import { Router } from "express";
import Route from "../../common/interface/routes.interface";

import validationMiddleware from "../../middlewares/validation.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

import paymentController from "./payment.controller";
import { reqPaymentDto, verifyPaymentDto } from "./payment.dto";

class PaymentRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/all', authMiddleware(true), paymentController.allUsersPaymentHistory);
        this.router.post('/verify', authMiddleware(true), verifyPaymentDto, validationMiddleware, paymentController.verifyPayment);
        this.router.use(authMiddleware());
        this.router.get('/', paymentController.userPaymentHistory);
        this.router.get("/tnxCharge", paymentController.getTransactionCharge);
        this.router.post("/reqPayment", reqPaymentDto, validationMiddleware, paymentController.reqPayment);
    }
}

export default PaymentRoute;   
