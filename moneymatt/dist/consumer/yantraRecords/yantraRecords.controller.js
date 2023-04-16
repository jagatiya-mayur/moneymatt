"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const yantraRecords_service_1 = __importDefault(require("./yantraRecords.service"));
let instance = null;
class YantraRecordsController {
    static getInstance() {
        if (instance == null) {
            instance = new YantraRecordsController();
        }
        return instance;
    }
    async newRecord(req, res, next) {
        try {
            const user = req.user;
            const newRecordInfo = req.body;
            if (user.balance < newRecordInfo.contractMoney) {
                throw new HttpException_1.default(globalConst_1.statusCode.BAD_REQUEST, "Insufficient Balance!");
            }
            const newRecord = await yantraRecords_service_1.default.newRecord(user._id, newRecordInfo);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(newRecord, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async myRecord(req, res, next) {
        try {
            const user = req.user;
            const recordQuery = req.query;
            const records = await yantraRecords_service_1.default.getRecordsPerPage(recordQuery, user._id);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(records, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = YantraRecordsController.getInstance();
//# sourceMappingURL=yantraRecords.controller.js.map