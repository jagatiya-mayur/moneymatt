"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const records_model_1 = __importDefault(require("./records.model"));
const results_service_1 = __importDefault(require("../../common/results/results.service"));
const utils_1 = require("../../utils/utils");
const users_service_1 = __importDefault(require("../../common/users/users.service"));
const results_model_1 = __importDefault(require("../../common/results/results.model"));
const emitter_1 = require("../../events/emitter");
const pricePercentage_model_1 = __importDefault(require("../../admin/pricePercentage/pricePercentage.model"));
const users_model_1 = __importDefault(require("../../common/users/users.model"));
let instance = null;
class RecordsService {
    constructor() {
        this.record = records_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new RecordsService();
        }
        return instance;
    }
    async getRecorById(id) {
        return await this.record.findOne({
            _id: id
        })
            .select("contractMoney color number amount fee status createdAt result")
            .populate({
            path: 'number',
            select: "number"
        }).populate({
            path: 'color',
            select: "color"
        }).populate({
            path: 'result',
            select: "gameType"
        });
    }
    async newRecord(userId, newRecordInfo) {
        const periodInfo = await results_service_1.default.checkResult(newRecordInfo.periodId);
        let number = newRecordInfo.number;
        let color = newRecordInfo.color;
        const amount = (0, utils_1.deduct2Per)(newRecordInfo.contractMoney);
        const newRecord = await this.record.create(Object.assign(Object.assign(Object.assign({ user: userId, result: newRecordInfo.periodId, contractMoney: newRecordInfo.contractMoney, fee: (0, utils_1.twoPerOfValue)(newRecordInfo.contractMoney) }, (number != undefined && number >= 0 && { number })), (color && { color })), { amount }));
        await results_model_1.default.findByIdAndUpdate(periodInfo._id, {
            $inc: {
                amount
            }
        });
        const user = await users_service_1.default.deductBalance(userId, newRecordInfo.contractMoney);
        emitter_1.recordEventEmitter.emit(emitter_1.NEW_RECORD, periodInfo._id, periodInfo.period);
        return {
            record: await this.getRecorById(newRecord._id),
            balance: user.balance
        };
    }
    async getRecordsByColor(gameType, period, color) {
        return await this.record.aggregate([
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
        return await this.record.aggregate([
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
        const { game, page } = recordQuery;
        const recordPerPage = 10;
        const recordCount = await this.record.aggregate([
            {
                '$match': {
                    'user': userId
                }
            },
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
                    'result.gameType': game,
                }
            }
        ]);
        let records = await this.record.aggregate([
            {
                '$match': {
                    'user': userId
                }
            },
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
                    'result.gameType': game,
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            }, {
                $project: {
                    contractMoney: 1,
                    color: 1,
                    number: 1,
                    amount: 1,
                    price: 1,
                    fee: 1,
                    status: 1,
                    createdAt: 1,
                    'result.gameType': 1,
                    'result.period': 1,
                    'result.price': 1,
                    'result.color': 1,
                    'result.number': 1,
                }
            }, {
                $skip: (page - 1) * recordPerPage
            }, {
                $limit: recordPerPage
            }
        ]);
        records = records.map((record) => {
            var _a;
            return {
                _id: record._id,
                contractMoney: record.contractMoney,
                select: record.color ? record.color : (_a = record.number) === null || _a === void 0 ? void 0 : _a.toString(),
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
    async updateWinnerBetByColor(resultId, color, price) {
        const winners = await this.record.find({
            isCompleted: false,
            result: resultId,
            status: globalConst_1.recordStatus.pending,
            color
        });
        let winnerPromises = [];
        for (const winner of winners) {
            winner.isCompleted = true;
            winner.status = globalConst_1.recordStatus.success;
            winner.price = winner.amount * price;
            winnerPromises.push(winner.save(), users_model_1.default.findOneAndUpdate({
                _id: winner.user
            }, {
                $inc: {
                    balance: winner.amount * price
                }
            }));
            await Promise.all(winnerPromises);
        }
    }
    async updateWinnerBetByNumber(resultId, number, price) {
        const winners = await this.record.find({
            result: resultId,
            isCompleted: false,
            status: globalConst_1.recordStatus.pending,
            number
        });
        let winnerPromises = [];
        for (const winner of winners) {
            winner.isCompleted = true;
            winner.status = globalConst_1.recordStatus.success;
            winner.price = winner.amount * price;
            winnerPromises.push(winner.save(), users_model_1.default.findOneAndUpdate({
                _id: winner.user
            }, {
                $inc: {
                    balance: winner.amount * price
                }
            }));
        }
        await Promise.all(winnerPromises);
    }
    async updateFailedBet(period) {
        const resultIds = await results_service_1.default.findIdsByPeriod(period);
        await this.record.updateMany({
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
        return await this.record.aggregate([
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
        var _a;
        let allGameResultBoardList = [];
        const allGamesResult = await results_model_1.default.find({
            period,
            isCompleted: false
        })
            .lean();
        for (const gameResult of allGamesResult) {
            let gameBoard = [
                {
                    number: 0,
                    color: [globalConst_1.colors.violet, globalConst_1.colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 1,
                    color: [globalConst_1.colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 2,
                    color: [globalConst_1.colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 3,
                    color: [globalConst_1.colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 4,
                    color: [globalConst_1.colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 5,
                    color: [globalConst_1.colors.violet, globalConst_1.colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 6,
                    color: [globalConst_1.colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 7,
                    color: [globalConst_1.colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 8,
                    color: [globalConst_1.colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    number: 9,
                    color: [globalConst_1.colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
            ];
            let gameBetTotalAmount = 0;
            let finalResult;
            let priceMoney;
            let earnAmount;
            const pricePer = await pricePercentage_model_1.default.findOne().lean();
            const numberBetTotal = await this.record.aggregate([
                {
                    '$match': {
                        'result': gameResult._id
                    }
                }, {
                    '$group': {
                        '_id': '$number',
                        'totalAmount': {
                            '$sum': '$amount'
                        }
                    }
                }
            ]);
            numberBetTotal.forEach((numberBetInfo) => {
                let index = numberBetInfo._id;
                if (index != null && index >= 0) {
                    gameBetTotalAmount += numberBetInfo.totalAmount;
                    gameBoard[index].betAmount += numberBetInfo.totalAmount;
                    gameBoard[index].lossAmount += numberBetInfo.totalAmount * 9;
                }
            });
            const colorBetTotal = await this.record.aggregate([
                {
                    '$match': {
                        'result': gameResult._id
                    }
                }, {
                    '$group': {
                        '_id': '$color',
                        'totalAmount': {
                            '$sum': '$amount'
                        }
                    }
                }
            ]);
            colorBetTotal.forEach((colorBetInfo) => {
                let index = colorBetInfo._id;
                if (index && globalConst_1.colorCombo[index]) {
                    gameBetTotalAmount += colorBetInfo.totalAmount;
                    globalConst_1.colorCombo[index].forEach(({ number, price }) => {
                        gameBoard[number].betAmount += colorBetInfo.totalAmount;
                        gameBoard[number].lossAmount += colorBetInfo.totalAmount * price;
                    });
                }
            });
            gameBoard.forEach((combo) => {
                if (gameBetTotalAmount) {
                    combo.loss = (combo.lossAmount / gameBetTotalAmount) * 100;
                }
                combo.earnAmount = gameBetTotalAmount - combo.lossAmount;
            });
            if (((_a = gameResult._id) === null || _a === void 0 ? void 0 : _a.toString()) == periodId.toString()) {
                if (gameResult.isSet) {
                    finalResult = {
                        color: gameResult.color,
                        number: gameResult.number
                    };
                }
                else {
                    gameBoard.sort((a, b) => b.loss - a.loss);
                    for (const combo of gameBoard) {
                        if (combo.loss <= pricePer.giveAwayPer) {
                            finalResult = {
                                color: combo.color,
                                number: combo.number
                            };
                            priceMoney = combo.lossAmount;
                            earnAmount = combo.earnAmount;
                            break;
                        }
                    }
                    if (!finalResult) {
                        finalResult = {
                            color: gameBoard[9].color,
                            number: gameBoard[9].number
                        };
                        priceMoney = gameBoard[9].lossAmount;
                        earnAmount = gameBoard[9].earnAmount;
                    }
                    await results_model_1.default.findByIdAndUpdate(gameResult._id, {
                        number: finalResult.number,
                        color: finalResult.color,
                        price: priceMoney,
                        earnAmount: earnAmount
                    });
                    gameBoard.sort((a, b) => a.number - b.number);
                }
            }
            else {
                finalResult = {
                    color: gameResult.color,
                    number: gameResult.number
                };
            }
            allGameResultBoardList.push({
                finalResult,
                gameType: gameResult.gameType,
                totalBetAmount: gameBetTotalAmount,
                gameBoard
            });
        }
        return allGameResultBoardList;
    }
    async getTotalBetAmount() {
        const betAmountData = await this.record.aggregate([
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
        await this.record.deleteMany({
            result: {
                $in: resultIds
            }
        });
    }
    async buddiesRecodsAmountInfo(userIds) {
        return await this.record.aggregate([
            {
                '$match': {
                    'user': {
                        '$in': userIds
                    },
                    'isCompleted': true
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
exports.default = RecordsService.getInstance();
//# sourceMappingURL=records.service.js.map