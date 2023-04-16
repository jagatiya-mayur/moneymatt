"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const results_model_1 = __importDefault(require("./results.model"));
const utils_1 = require("../../utils/utils");
const records_service_1 = __importDefault(require("../../consumer/records/records.service"));
const emitter_1 = require("../../events/emitter");
const results_model_2 = __importDefault(require("./results.model"));
const records_model_1 = __importDefault(require("../../consumer/records/records.model"));
const users_service_1 = __importDefault(require("../users/users.service"));
const users_model_1 = __importDefault(require("../users/users.model"));
let instance = null;
class ResultsService {
    constructor() {
        this.result = results_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new ResultsService();
        }
        return instance;
    }
    async getPeriodInfo(period) {
        return await this.result.findOne({
            period
        });
    }
    async currentPeriod(gameType) {
        const date = new Date();
        const period = (0, utils_1.getPeriod)(date);
        return await this.result.findOne({
            period,
            gameType
        })
            .lean()
            .select("period gameType startTime endTime");
    }
    async initializeResult(period, date) {
        const allGamePeriodInfo = [];
        const isResultData = await this.result.find({ period, isDeleted: false }).lean();
        if (isResultData.length) {
            isResultData.forEach((gameResult) => {
                allGamePeriodInfo.push({
                    gameType: gameResult.gameType,
                    period: gameResult.period,
                    startTime: gameResult.startTime,
                    endTime: gameResult.endTime
                });
            });
        }
        else {
            const resultData = globalConst_1.games.map((gameType) => {
                const randomBetween09 = (0, utils_1.randomInRange)(0, 9);
                const periodInfo = {
                    gameType,
                    period,
                    startTime: date,
                    endTime: (Number(date) + 3 * 60 * 1000),
                };
                allGamePeriodInfo.push(periodInfo);
                return Object.assign(Object.assign({}, periodInfo), { number: randomBetween09, color: globalConst_1.combinations[randomBetween09].colors });
            });
            await this.result.insertMany(resultData);
        }
        emitter_1.resultEventEmitter.emit(emitter_1.NEW_PERIOD, allGamePeriodInfo);
    }
    async initializeFutureResult(period, date) {
        const resultData = globalConst_1.games.map((gameType) => {
            const randomBetween09 = (0, utils_1.randomInRange)(0, 9);
            const periodInfo = {
                gameType,
                period,
                startTime: (Number(date) + 3 * 60 * 1000),
                endTime: (Number(date) + 6 * 60 * 1000),
            };
            return Object.assign(Object.assign({}, periodInfo), { number: randomBetween09, color: globalConst_1.combinations[randomBetween09].colors });
        });
        await this.result.insertMany(resultData);
    }
    async updateResult(period, result) {
        await this.result.findOneAndUpdate({
            period,
            gameType: result.gameType,
            isCompleted: false
        }, {
            number: result.number,
            color: result.color
        });
    }
    async findIdsByPeriod(period) {
        const ids = await this.result.find({
            period
        }).transform((doc) => {
            return doc.map((element) => element._id);
        });
        return ids;
    }
    async findResultsByPeriod(period) {
        return await this.result.find({
            period,
            $isDeleted: false
        }).lean();
    }
    async getResultById(_id) {
        return await this.result.findById(_id).lean();
    }
    async checkResult(_id) {
        const resultInfo = await this.getResultById(_id);
        if (!resultInfo) {
            throw new HttpException_1.default(globalConst_1.statusCode.BAD_REQUEST, "Invalid resultId");
        }
        if (resultInfo.isCompleted) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Period Expired!");
        }
        return resultInfo;
    }
    async getResults(resultGetQuey) {
        const { game, page } = resultGetQuey;
        const recordPerPage = 10;
        const resultsCount = await this.result.find({
            gameType: game,
            isCompleted: true
        })
            .sort({ createdAt: -1 })
            .limit(480)
            .count();
        const results = await this.result.find({
            gameType: game,
            isCompleted: true
        }, {
            gameType: 1,
            period: 1,
            price: 1,
            number: 1,
            color: 1,
            isCompleted: 1
        })
            .lean()
            .sort({ createdAt: -1 })
            .limit(480)
            .skip((page - 1) * recordPerPage)
            .limit(recordPerPage);
        return {
            results,
            pageSize: recordPerPage,
            pageNum: page,
            totalPage: Math.ceil(resultsCount / recordPerPage),
            totalResults: resultsCount
        };
    }
    async getAllResults() {
        const results = await this.result.find({
            isCompleted: true
        }, {
            gameType: 1,
            period: 1,
            price: 1,
            number: 1,
            color: 1,
            amount: 1
        })
            .lean()
            .sort({ createdAt: -1 })
            .limit(480);
        return results;
    }
    async updateRsulttoComplete(period) {
        await this.result.updateMany({
            period,
            isCompleted: false
        }, {
            isCompleted: true
        });
    }
    async updateTotalPrice(period) {
        const priceAmountInfo = await records_service_1.default.getTotalPriceAmount(period);
        for (const priceInfo of priceAmountInfo) {
            await this.result.findOneAndUpdate({
                period,
                isCompleted: false,
                gameType: priceInfo._id
            }, {
                price: priceInfo.price,
            });
        }
    }
    async deleteRecords() {
    }
    async setResult(setResultBody) {
        const periodInfo = await this.result.findOneAndUpdate({
            gameType: setResultBody.gameType,
            period: setResultBody.period,
            isCompleted: false
        }, {
            number: setResultBody.number,
            color: globalConst_1.combinations[setResultBody.number].colors,
            isSet: true,
        }, {
            new: true
        }).lean();
        if (!periodInfo) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Period Expired!");
        }
    }
    async getCurrentResult(period) {
        let allGameResultBoardList = [];
        const allGamesResult = await results_model_2.default.find({
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
            const numberBetTotal = await records_model_1.default.aggregate([
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
            const colorBetTotal = await records_model_1.default.aggregate([
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
            finalResult = {
                color: gameResult.color,
                number: gameResult.number
            };
            allGameResultBoardList.push({
                finalResult,
                gameType: gameResult.gameType,
                totalBetAmount: gameBetTotalAmount,
                gameBoard
            });
        }
        return allGameResultBoardList;
    }
    async resultDeclaration(period) {
        try {
            const resultIds = await this.findResultsByPeriod(period);
            if (resultIds.length == 0) {
                throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Results not found!");
            }
            for (const result of resultIds) {
                await this.resultDeclarationPerGame(result);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async resultDeclarationPerGame(result) {
        const number = result.number;
        const colorsPrice = globalConst_1.priceCombo[number];
        let priceAmount = 0;
        if (result.isSet) {
            const winners = await records_model_1.default.find({
                result: result._id,
                isCompleted: false,
                status: globalConst_1.recordStatus.pending,
                number
            });
            let winnerPromises = [];
            for (const winner of winners) {
                priceAmount += winner.amount * 9;
                winner.isCompleted = true;
                winner.status = globalConst_1.recordStatus.success;
                winner.price = winner.amount * 9;
                winnerPromises.push(winner.save(), users_model_1.default.findOneAndUpdate({
                    _id: winner.user
                }, {
                    $inc: {
                        balance: winner.amount * 9
                    }
                }));
            }
            for (const colorPrice of colorsPrice) {
                const { color, price } = colorPrice;
                const winners = await records_model_1.default.find({
                    isCompleted: false,
                    result: result._id,
                    status: globalConst_1.recordStatus.pending,
                    color
                });
                for (const winner of winners) {
                    priceAmount += winner.amount * price;
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
            }
            await Promise.all(winnerPromises);
            await records_model_1.default.updateMany({
                result: result._id,
                isCompleted: false,
                status: globalConst_1.recordStatus.pending,
            }, {
                status: globalConst_1.recordStatus.failed,
                isCompleted: true
            });
            await this.result.updateOne({
                _id: result._id,
                isCompleted: false
            }, {
                isCompleted: true,
                price: priceAmount,
                earnAmount: result.amount - priceAmount
            });
        }
        else {
            await records_service_1.default.updateWinnerBetByNumber(result._id, number, 9);
            for (const colorPrice of colorsPrice) {
                const { color, price } = colorPrice;
                await records_service_1.default.updateWinnerBetByColor(result._id, color, price);
            }
            await records_model_1.default.updateMany({
                result: result._id,
                isCompleted: false,
                status: globalConst_1.recordStatus.pending,
            }, {
                status: globalConst_1.recordStatus.failed,
                isCompleted: true
            });
            await this.result.updateOne({
                _id: result._id,
                isCompleted: false
            }, {
                isCompleted: true
            });
        }
    }
    async getTotalBetAmount() {
        const betAmountData = await this.result.aggregate([
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
    async getTotalEarning() {
        const totalEarningData = await this.result.aggregate([
            {
                '$match': {
                    'isCompleted': true
                }
            },
            {
                '$group': {
                    '_id': null,
                    'totalEarning': {
                        '$sum': '$earnAmount'
                    }
                }
            }
        ]);
        return totalEarningData[0] ? totalEarningData[0].totalEarning : 0;
    }
    async getTotalPrize() {
        const totalPrizeData = await this.result.aggregate([
            {
                '$match': {
                    'isCompleted': true
                }
            },
            {
                '$group': {
                    '_id': null,
                    'totalPrice': {
                        '$sum': '$price'
                    }
                }
            }
        ]);
        return totalPrizeData[0] ? totalPrizeData[0].totalPrice : 0;
    }
    async getDashBoardData() {
        const totalBetAmount = await this.getTotalBetAmount();
        const totalEarning = await this.getTotalEarning();
        const totalPrize = await this.getTotalPrize();
        const totalUser = await users_service_1.default.userCount();
        return {
            totalBetAmount,
            totalEarning,
            totalPrize,
            totalUser
        };
    }
    async getTwoDaysAgoResults(twoDayAgoDate) {
        const ids = await this.result.find({
            createdAt: {
                $lt: twoDayAgoDate
            }
        }).transform((doc) => {
            return doc.map((element) => element._id);
        });
        return ids;
    }
    async deleteResults() {
        const date = new Date();
        const twoDayAgoDate = new Date(date.getTime() - 24 * 60 * 60 * 1000 * 2);
        const ids = await this.getTwoDaysAgoResults(twoDayAgoDate);
        await records_service_1.default.deleteRecords(ids);
        await this.result.deleteMany({
            createdAt: {
                $lt: twoDayAgoDate
            }
        });
    }
}
exports.default = ResultsService.getInstance();
//# sourceMappingURL=results.service.js.map