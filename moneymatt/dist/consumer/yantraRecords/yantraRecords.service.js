"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const globalConst_1 = require("../../utils/globalConst");
const yantraRecords_model_1 = __importDefault(require("./yantraRecords.model"));
const yantraResults_service_1 = __importDefault(require("../../common/yantraResults/yantraResults.service"));
const utils_1 = require("../../utils/utils");
const users_service_1 = __importDefault(require("../../common/users/users.service"));
const yantraResults_model_1 = __importDefault(require("../../common/yantraResults/yantraResults.model"));
const emitter_1 = require("../../events/emitter");
const pricePercentage_model_1 = __importDefault(require("../../admin/yantraPricePercentage/pricePercentage.model"));
let instance = null;
class YantraRecordsService {
    constructor() {
        this.yantraRecord = yantraRecords_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new YantraRecordsService();
        }
        return instance;
    }
    async getRecorById(id) {
        return await this.yantraRecord.findOne({
            _id: id
        })
            .select("contractMoney amount fee status createdAt yantra");
    }
    async newRecord(userId, newRecordInfo) {
        const periodInfo = await yantraResults_service_1.default.checkResult(newRecordInfo.periodId);
        const amount = (0, utils_1.deduct2Per)(newRecordInfo.contractMoney);
        const newRecord = await this.yantraRecord.create({
            user: userId,
            result: newRecordInfo.periodId,
            contractMoney: newRecordInfo.contractMoney,
            fee: (0, utils_1.twoPerOfValue)(newRecordInfo.contractMoney),
            amount,
            select: newRecordInfo.yantra
        });
        await yantraResults_model_1.default.findByIdAndUpdate(periodInfo._id, {
            $inc: {
                betAmount: amount
            }
        });
        const user = await users_service_1.default.deductBalance(userId, newRecordInfo.contractMoney);
        emitter_1.yantraRecordEventEmitter.emit(emitter_1.NEW_YANTRA_RECORD, periodInfo._id, periodInfo.period);
        return {
            record: await this.getRecorById(newRecord._id),
            balance: user.balance
        };
    }
    async getRecordsByColor(gameType, period, color) {
        return await this.yantraRecord.aggregate([
            {
                '$lookup': {
                    'from': 'results',
                    'localField': 'result',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$unwind': {
                    'path': '$result'
                }
            }, {
                '$match': {
                    'result.gameType': gameType,
                    'result.period': period,
                    'isCompleted': false,
                    'color': color
                }
            }
        ]);
    }
    async getRecordsByNumber(gameType, period, number) {
        return await this.yantraRecord.aggregate([
            {
                '$lookup': {
                    'from': 'results',
                    'localField': 'result',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$unwind': {
                    'path': '$result'
                }
            }, {
                '$match': {
                    'result.gameType': gameType,
                    'result.period': period,
                    'isCompleted': false,
                    'number': number
                }
            }
        ]);
    }
    async getRecordsPerPage(recordQuery, userId) {
        const { page } = recordQuery;
        const recordPerPage = 10;
        const recordCount = await this.yantraRecord.aggregate([
            {
                '$match': {
                    'user': new mongoose_1.Types.ObjectId(userId)
                }
            },
            {
                '$lookup': {
                    'from': 'yantraresults',
                    'localField': 'result',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$unwind': {
                    'path': '$result'
                }
            }
        ]);
        let records = await this.yantraRecord.aggregate([
            {
                '$match': {
                    'user': new mongoose_1.Types.ObjectId(userId)
                }
            },
            {
                '$lookup': {
                    'from': 'yantraresults',
                    'localField': 'result',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$unwind': {
                    'path': '$result'
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            }, {
                $project: {
                    contractMoney: 1,
                    select: 1,
                    amount: 1,
                    price: 1,
                    fee: 1,
                    status: 1,
                    createdAt: 1,
                    'result.period': 1,
                    'result.openPrice': 1,
                    'result.yantra': 1,
                }
            }, {
                $skip: (page - 1) * recordPerPage
            }, {
                $limit: recordPerPage
            }
        ]);
        records = records.map((record) => {
            return {
                _id: record._id,
                contractMoney: record.contractMoney,
                select: record.select,
                amount: record.amount,
                price: record.status == globalConst_1.recordStatus.success ? record.price : (record.status == globalConst_1.recordStatus.failed ? -record.amount : 0),
                fee: record.fee,
                status: record.status,
                period: record.result.period,
                result: record.status == globalConst_1.recordStatus.pending ? null : record.result,
                createdAt: record.createdAt
            };
        });
        return {
            records,
            pageSize: recordPerPage,
            pageNum: page,
            totalPage: Math.ceil(recordCount.length / recordPerPage),
            totalResults: recordCount.length
        };
    }
    async updateFailedBet(period) {
        const resultIds = await yantraResults_service_1.default.findIdsByPeriod(period);
        await this.yantraRecord.updateMany({
            isCompleted: false,
            status: globalConst_1.recordStatus.pending,
            result: {
                $in: resultIds
            }
        }, {
            isCompleted: true,
            status: globalConst_1.recordStatus.failed,
        });
    }
    async getTotalPriceAmount(period) {
        return await this.yantraRecord.aggregate([
            {
                '$lookup': {
                    'from': 'results',
                    'localField': 'result',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$unwind': {
                    'path': '$result'
                }
            }, {
                '$match': {
                    'result.period': period,
                }
            }, {
                '$group': {
                    '_id': '$result.gameType',
                    'price': {
                        '$sum': '$price'
                    }
                }
            }
        ]);
    }
    async sendResultToSocket(periodId, period) {
        let totalBetAmount = 0;
        let finalResult;
        const gameResult = await yantraResults_model_1.default.findOne({
            period,
            isCompleted: false
        })
            .lean();
        let gameBoard = [
            {
                number: 0,
                yantra: globalConst_1.yantra.shree,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 1,
                yantra: globalConst_1.yantra.vashikaran,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 2,
                yantra: globalConst_1.yantra.sudarshan,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 3,
                yantra: globalConst_1.yantra.vastu,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 4,
                yantra: globalConst_1.yantra.planet,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 5,
                yantra: globalConst_1.yantra.love,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 6,
                yantra: globalConst_1.yantra.tara,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 7,
                yantra: globalConst_1.yantra.grah,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 8,
                yantra: globalConst_1.yantra.matsya,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                number: 9,
                yantra: globalConst_1.yantra.meditation,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
        ];
        const totalBet = await this.getTotalBetsPerYantra(gameResult._id);
        totalBet.forEach((yantraBetInfo) => {
            let yantra = yantraBetInfo._id;
            const index = globalConst_1.yantras.findIndex((data) => data === yantra);
            totalBetAmount += yantraBetInfo.totalAmount;
            gameBoard[index].betAmount += yantraBetInfo.totalAmount;
            gameBoard[index].lossAmount += yantraBetInfo.totalAmount * 9;
        });
        gameBoard.forEach((combo) => {
            if (totalBetAmount) {
                combo.loss = (combo.lossAmount / totalBetAmount) * 100;
            }
            combo.earnAmount = totalBetAmount - combo.lossAmount;
        });
        if (gameResult.isSet) {
            finalResult = gameResult.yantra;
            const index = globalConst_1.yantras.findIndex((data) => data === finalResult);
            await yantraResults_model_1.default.findByIdAndUpdate(gameResult._id, {
                openPrice: gameBoard[index].lossAmount,
                earnAmount: gameBoard[index].earnAmount,
            });
        }
        else {
            let priceMoney;
            let earnAmount;
            const pricePer = await pricePercentage_model_1.default.findOne().lean();
            gameBoard.sort((a, b) => b.loss - a.loss);
            for (const combo of gameBoard) {
                if (combo.loss <= pricePer.giveAwayPer) {
                    finalResult = combo.yantra;
                    priceMoney = combo.lossAmount;
                    earnAmount = combo.earnAmount;
                    break;
                }
            }
            if (!finalResult) {
                finalResult = gameBoard[9].yantra;
                priceMoney = gameBoard[9].lossAmount;
                earnAmount = gameBoard[9].earnAmount;
            }
            await yantraResults_model_1.default.findByIdAndUpdate(gameResult._id, {
                yantra: finalResult
            });
            gameBoard.sort((a, b) => a.number - b.number);
        }
        return {
            finalResult,
            totalBetAmount,
            gameBoard
        };
    }
    async getTotalBetAmount() {
        const betAmountData = await this.yantraRecord.aggregate([
            {
                '$match': {
                    'isCompleted': true
                }
            },
            {
                '$group': {
                    '_id': null,
                    'totalBetAmount': {
                        '$sum': '$amount'
                    }
                }
            }
        ]);
        return betAmountData[0] ? betAmountData[0].totalBetAmount : 0;
    }
    async deleteRecords(resultIds) {
        await this.yantraRecord.deleteMany({
            result: {
                $in: resultIds
            }
        });
    }
    async getTotalBetsPerYantra(resultId) {
        return await this.yantraRecord.aggregate([
            {
                '$match': {
                    'result': new mongoose_1.Types.ObjectId(resultId)
                }
            }, {
                '$group': {
                    '_id': '$select',
                    'totalAmount': {
                        '$sum': '$amount'
                    }
                }
            }
        ]);
    }
    async yantraRecodsAmountInfo(userIds) {
        return this.yantraRecord.aggregate([
            {
                '$match': {
                    'user': {
                        '$in': userIds
                    },
                    isCompleted: true
                }
            }, {
                '$group': {
                    '_id': '$user',
                    'betAmount': {
                        '$sum': '$amount'
                    },
                    'priceAmount': {
                        '$sum': '$price'
                    }
                }
            }, {
                '$project': {
                    'user': '$_id',
                    'betAmount': 1,
                    'earnAmount': {
                        '$subtract': [
                            '$betAmount', '$priceAmount'
                        ]
                    }
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user',
                    'foreignField': '_id',
                    'as': 'user',
                    pipeline: [
                        {
                            $project: {
                                "balance": 1,
                                "phone": 1,
                                "email": 1
                            }
                        }
                    ]
                }
            }, {
                '$unwind': {
                    'path': '$user'
                }
            }
        ]);
    }
}
exports.default = YantraRecordsService.getInstance();
//# sourceMappingURL=yantraRecords.service.js.map