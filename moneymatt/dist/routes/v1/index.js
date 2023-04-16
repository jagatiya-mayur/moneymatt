"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../../common/auth/auth.routes"));
const users_routes_1 = __importDefault(require("../../common/users/users.routes"));
const payment_routes_1 = __importDefault(require("../../consumer/payment/payment.routes"));
const records_routes_1 = __importDefault(require("../../consumer/records/records.routes"));
const yantraRecords_routes_1 = __importDefault(require("../../consumer/yantraRecords/yantraRecords.routes"));
const results_routes_1 = __importDefault(require("../../common/results/results.routes"));
const queries_routes_1 = __importDefault(require("../../common/queries/queries.routes"));
const pricePercentage_routes_1 = __importDefault(require("../../admin/pricePercentage/pricePercentage.routes"));
const pricePercentage_routes_2 = __importDefault(require("../../admin/yantraPricePercentage/pricePercentage.routes"));
const yantraResults_routes_1 = __importDefault(require("../../common/yantraResults/yantraResults.routes"));
const withdrawals_routes_1 = __importDefault(require("../../consumer/withdrawals/withdrawals.routes"));
const referals_routes_1 = __importDefault(require("../../common/referals/referals.routes"));
const referEarnAmount_routes_1 = __importDefault(require("../../admin/referEarnAmount/referEarnAmount.routes"));
const account_routes_1 = __importDefault(require("../../admin/account/account.routes"));
const appInfo_routes_1 = __importDefault(require("../../admin/appInfo/appInfo.routes"));
class V1Routes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use('/auth', new auth_routes_1.default().router);
        this.router.use('/user', new users_routes_1.default().router);
        this.router.use('/payment', new payment_routes_1.default().router);
        this.router.use('/record', new records_routes_1.default().router);
        this.router.use('/yantraRecord', new yantraRecords_routes_1.default().router);
        this.router.use('/result', new results_routes_1.default().router);
        this.router.use('/yantraResult', new yantraResults_routes_1.default().router);
        this.router.use('/query', new queries_routes_1.default().router);
        this.router.use('/pricePer', new pricePercentage_routes_1.default().router);
        this.router.use('/yantraPricePer', new pricePercentage_routes_2.default().router);
        this.router.use('/withdrawal', new withdrawals_routes_1.default().router);
        this.router.use('/referals', new referals_routes_1.default().router);
        this.router.use('/referEarnAmount', new referEarnAmount_routes_1.default().router);
        this.router.use('/account', new account_routes_1.default().router);
        this.router.use('/app', new appInfo_routes_1.default().router);
    }
}
exports.default = V1Routes;
//# sourceMappingURL=index.js.map