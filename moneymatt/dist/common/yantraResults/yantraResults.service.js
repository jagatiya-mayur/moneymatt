"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const HttpException_1 = __importDefault(require("../../exceptions/HttpException"));
const utils_1 = require("../../utils/utils");
const emitter_1 = require("../../events/emitter");
const users_service_1 = __importDefault(require("../users/users.service"));
const yantraRecords_service_1 = __importDefault(require("../../consumer/yantraRecords/yantraRecords.service"));
const yantraRecords_model_1 = __importDefault(require("../../consumer/yantraRecords/yantraRecords.model"));
const yantraResults_model_1 = __importDefault(require("./yantraResults.model"));
const users_model_1 = __importDefault(require("../users/users.model"));
let instance = null;
class YantraResultsService {
    constructor() {
        this.yantraResult = yantraResults_model_1.default;
    }
    static getInstance() {
        if (instance == null) {
            instance = new YantraResultsService();
        }
        return instance;
    }
    async getPeriodInfo(period) {
        return await this.yantraResult.findOne({
            period
        });
    }
    async currentPeriod() {
        const date = new Date();
        const period = (0, utils_1.getYantraPeriod)(date);
        return await this.yantraResult.findOne({
            period,
        })
            .lean()
            .select("period startTime endTime");
    }
    async initializeResult(period, date) {
        const isResultData = await this.yantraResult.findOne({ period, isDeleted: false }).lean();
        let periodInfo;
        if (isResultData) {
            periodInfo = {
                period,
                startTime: date,
                endTime: (Number(date) + 5 * 60 * 1000)
            };
        }
        else {
            const randomBetween09 = (0, utils_1.randomInRange)(0, 9);
            periodInfo = {
                period,
                startTime: date,
                endTime: (Number(date) + 5 * 60 * 1000),
            };
            await this.yantraResult.create(Object.assign(Object.assign({}, periodInfo), { yantra: globalConst_1.yantras[randomBetween09] }));
        }
        emitter_1.yantraResultEventEmitter.emit(emitter_1.NEW_YANTRA_PERIOD, periodInfo);
    }
    async initializeFutureResult(period, date) {
        const randomBetween09 = (0, utils_1.randomInRange)(0, 9);
        const periodInfo = {
            period,
            startTime: (Number(date) + 5 * 60 * 1000),
            endTime: (Number(date) + 10 * 60 * 1000),
            yantra: globalConst_1.yantras[randomBetween09]
        };
        await this.yantraResult.create(periodInfo);
    }
    async findIdsByPeriod(period) {
        const ids = await this.yantraResult.find({
            period
        }).transform((doc) => {
            return doc.map((element) => element._id);
        });
        return ids;
    }
    async findResultByPeriod(period) {
        return await this.yantraResult.findOne({
            period,
            $isDeleted: false
        }).lean();
    }
    async getResultById(_id) {
        return await this.yantraResult.findById(_id).lean();
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
        const { page } = resultGetQuey;
        const recordPerPage = 10;
        const resultsCount = await this.yantraResult.find({
            isCompleted: true
        })
            .sort({ createdAt: -1 })
            .limit(480)
            .count();
        const results = await this.yantraResult.find({
            isCompleted: true
        }, {
            period: 1,
            openPrice: 1,
            yantra: 1,
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
        const results = await this.yantraResult.find({
            isCompleted: true
        }, {
            period: 1,
            openPrice: 1,
            yantra: 1,
            betAmount: 1,
            earnAmount: 1
        })
            .lean()
            .sort({ createdAt: -1 })
            .limit(480);
        return results;
    }
    async updateRsulttoComplete(period) {
        await this.yantraResult.updateMany({
            period,
            isCompleted: false
        }, {
            isCompleted: true
        });
    }
    async deleteRecords() {
    }
    async setResult(setResultBody) {
        const periodInfo = await this.yantraResult.findOneAndUpdate({
            period: setResultBody.period,
            isCompleted: false
        }, {
            yantra: setResultBody.yantra,
            isSet: true,
        }, {
            new: true
        }).lean();
        if (!periodInfo) {
            throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Period Expired!");
        }
    }
    async getCurrentResult(period) {
        let totalBetAmount = 0;
        const gamesResult = await yantraResults_model_1.default.findOne({
            period,
            isCompleted: false
        })
            .lean();
        let gameBoard = [
            {
                yantra: globalConst_1.yantra.shree,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.vashikaran,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.sudarshan,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.vastu,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.planet,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.love,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.tara,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.grah,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.matsya,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                yantra: globalConst_1.yantra.meditation,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
        ];
        const totalBet = await yantraRecords_service_1.default.getTotalBetsPerYantra(gamesResult._id);
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
        return {
            finalResult: gamesResult.yantra,
            totalBetAmount: totalBetAmount,
            gameBoard
        };
    }
    async resultDeclaration(period) {
        try {
            const periodResult = await this.findResultByPeriod(period);
            if (!periodResult) {
                throw new HttpException_1.default(globalConst_1.statusCode.NOT_FOUND, "Results not found!");
            }
            await this.resultDeclarationPerGame(periodResult);
        }
        catch (error) {
            console.log(error);
        }
    }
    async resultDeclarationPerGame(result) {
        const yantra = result.yantra;
        let priceAmount = 0;
        const winners = await yantraRecords_model_1.default.find({
            result: result._id,
            isCompleted: false,
            status: globalConst_1.recordStatus.pending,
            select: yantra
        });
        const winnerPromises = [];
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
        await Promise.all(winnerPromises);
        await yantraRecords_model_1.default.updateMany({
            result: result._id,
            isCompleted: false,
            status: globalConst_1.recordStatus.pending,
        }, {
            status: globalConst_1.recordStatus.failed,
            isCompleted: true
        });
        await this.yantraResult.updateMany({
            _id: result._id,
            isCompleted: false
        }, {
            isCompleted: true,
            openPrice: priceAmount,
            earnAmount: (result.betAmount - priceAmount)
        });
    }
    async getTotalBetAmount() {
        const betAmountData = await this.yantraResult.aggregate([
            {
                '$match': {
                    'isCompleted': true
                }
            },
            {
                '$group': {
                    '_id': null,
                    'totalBetAmount': {
                        '$sum': '$betAmount'
                    }
                }
            }
        ]);
        return betAmountData[0] ? betAmountData[0].totalBetAmount : 0;
    }
    async getTotalEarning() {
        const totalEarningData = await this.yantraResult.aggregate([
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
        const totalPrizeData = await this.yantraResult.aggregate([
            {
                '$match': {
                    'isCompleted': true
                }
            },
            {
                '$group': {
                    '_id': null,
                    'totalPrice': {
                        '$sum': '$openPrice'
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
        const ids = await this.yantraResult.find({
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
        await yantraRecords_service_1.default.deleteRecords(ids);
        await this.yantraResult.deleteMany({
            createdAt: {
                $lt: twoDayAgoDate
            }
        });
    }
}
exports.default = YantraResultsService.getInstance();
//# sourceMappingURL=yantraResults.service.js.map