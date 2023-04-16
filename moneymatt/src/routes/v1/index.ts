import { Router } from "express";

import Route from "../../common/interface/routes.interface";
import AuthRoute from "../../common/auth/auth.routes";
import UsersRoute from "../../common/users/users.routes";
import PaymentRoute from "../../consumer/payment/payment.routes";
import RecordsRoute from "../../consumer/records/records.routes";
import YantraRecordsRoute from "../../consumer/yantraRecords/yantraRecords.routes";
import ResultsRoute from "../../common/results/results.routes";
import QueriesRoute from "../../common/queries/queries.routes";
import PricePercentageRoute from "../../admin/pricePercentage/pricePercentage.routes";
import YantraPricePercentageRoute from "../../admin/yantraPricePercentage/pricePercentage.routes";
import YantraResultsRoute from "../../common/yantraResults/yantraResults.routes";
import WithrawalsRoute from "../../consumer/withdrawals/withdrawals.routes";
import ReferalsRoute from "../../common/referals/referals.routes";
import ReferEarnAmountRoutes from "../../admin/referEarnAmount/referEarnAmount.routes";
import AccountRoute from "../../admin/account/account.routes";
import AppInfoRoute from "../../admin/appInfo/appInfo.routes";

class V1Routes implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use('/auth', new AuthRoute().router);
        this.router.use('/user', new UsersRoute().router);
        this.router.use('/payment', new PaymentRoute().router);
        this.router.use('/record', new RecordsRoute().router);
        this.router.use('/yantraRecord', new YantraRecordsRoute().router);
        this.router.use('/result', new ResultsRoute().router);
        this.router.use('/yantraResult', new YantraResultsRoute().router);
        this.router.use('/query', new QueriesRoute().router);
        this.router.use('/pricePer', new PricePercentageRoute().router);
        this.router.use('/yantraPricePer', new YantraPricePercentageRoute().router);
        this.router.use('/withdrawal', new WithrawalsRoute().router);
        this.router.use('/referals', new ReferalsRoute().router);
        this.router.use('/referEarnAmount', new ReferEarnAmountRoutes().router);
        this.router.use('/account', new AccountRoute().router);
        this.router.use('/app', new AppInfoRoute().router);
    }
}

export default V1Routes;