import { Types } from "mongoose";

import { colorCombo, colors, combinations, games, InitGameBoard, priceCombo, recordStatus, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";

import resultModel from "./results.model";
import { getPeriod, randomInRange } from "../../utils/utils";
import { EstimateData, Result, ResultGetQuery, SetResultBody } from "./results.interface";
import recordsService from "../../consumer/records/records.service";
import { NEW_PERIOD, resultEventEmitter } from "../../events/emitter";
import ResultModel from "./results.model";
import { ColorBetTotal, NumberBetTotal, RecordDoc } from "../../consumer/records/records.interface";
import RecordModel from "../../consumer/records/records.model";
import usersService from "../users/users.service";
import UserModel from "../users/users.model";

let instance: null | ResultsService = null;

class ResultsService {
    private result = resultModel;

    static getInstance(): ResultsService {
        if (instance == null) {
            instance = new ResultsService();
        }

        return instance;
    }

    public async getPeriodInfo(period: number) {
        return await this.result.findOne({
            period
        });
    }

    public async currentPeriod(gameType: string): Promise<any> {
        const date: Date = new Date();
        const period = getPeriod(date);

        return await this.result.findOne({
            period,
            gameType
        })
            .lean()
            .select("period gameType startTime endTime");
    }

    public async initializeResult(period: number, date: Date) {
        const allGamePeriodInfo: Array<any> = [];

        const isResultData: Array<Result> = await this.result.find({ period, isDeleted: false }).lean();

        if (isResultData.length) {

            isResultData.forEach((gameResult) => {
                allGamePeriodInfo.push({
                    gameType: gameResult.gameType,
                    period: gameResult.period,
                    startTime: gameResult.startTime,
                    endTime: gameResult.endTime
                })
            });

        } else {

            const resultData = games.map((gameType: any) => {
                const randomBetween09 = randomInRange(0, 9);
                const periodInfo = {
                    gameType,
                    period,
                    startTime: date,
                    endTime: (Number(date) + 3 * 60 * 1000),
                }
                allGamePeriodInfo.push(periodInfo);

                return {
                    ...periodInfo,
                    number: randomBetween09,
                    color: combinations[randomBetween09].colors
                }
            });

            await this.result.insertMany(resultData);
        }
        resultEventEmitter.emit(NEW_PERIOD, allGamePeriodInfo);
    }

    public async initializeFutureResult(period: number, date: Date) {
        const resultData = games.map((gameType: any) => {
            const randomBetween09 = randomInRange(0, 9);
            const periodInfo = {
                gameType,
                period,
                startTime: (Number(date) + 3 * 60 * 1000),
                endTime: (Number(date) + 6 * 60 * 1000),
            }
            return {
                ...periodInfo,
                number: randomBetween09,
                color: combinations[randomBetween09].colors
            }
        });

        await this.result.insertMany(resultData);
    }

    public async updateResult(period: number, result: EstimateData): Promise<void> {
        await this.result.findOneAndUpdate(
            {
                period,
                gameType: result.gameType,
                isCompleted: false
            },
            {
                number: result.number,
                color: result.color
            }
        );
    }

    public async findIdsByPeriod(period: number): Promise<Array<Types.ObjectId>> {
        const ids: Types.ObjectId[] = await this.result.find({
            period
        }).transform((doc) => {
            return doc.map((element: any) => element._id);
        });

        return ids;
    }

    public async findResultsByPeriod(period: number): Promise<Array<Result>> {
        return await this.result.find({
            period,
            $isDeleted: false
        }).lean();
    }

    public async getResultById(_id: Types.ObjectId): Promise<Result> {
        return await this.result.findById(_id).lean();
    }

    public async checkResult(_id: Types.ObjectId): Promise<Result> {
        const resultInfo: Result = await this.getResultById(_id);

        if (!resultInfo) {
            throw new HttpException(statusCode.BAD_REQUEST, "Invalid resultId");
        }

        if (resultInfo.isCompleted) {
            throw new HttpException(statusCode.NOT_FOUND, "Period Expired!");
        }

        return resultInfo
    }

    public async getResults(resultGetQuey: ResultGetQuery) {
        const { game, page } = resultGetQuey;
        const recordPerPage = 10;
        const resultsCount: number = await this.result.find(
            {
                gameType: game,
                isCompleted: true
            }
        )
            .sort({ createdAt: -1 })
            .limit(480)
            .count();

        const results: Result[] = await this.result.find(
            {
                gameType: game,
                isCompleted: true
            },
            {
                gameType: 1,
                period: 1,
                price: 1,
                number: 1,
                color: 1,
                isCompleted: 1
            }
        )
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

    public async getAllResults() {

        const results: Result[] = await this.result.find(
            {
                isCompleted: true
            },
            {
                gameType: 1,
                period: 1,
                price: 1,
                number: 1,
                color: 1,
                amount: 1
            }
        )
            .lean()
            .sort({ createdAt: -1 })
            .limit(480);

        return results;
    }

    public async updateRsulttoComplete(period: number): Promise<any> {
        await this.result.updateMany(
            {
                period,
                isCompleted: false
            },
            {
                isCompleted: true
            }
        );
    }

    public async updateTotalPrice(period: number): Promise<void> {
        const priceAmountInfo: any = await recordsService.getTotalPriceAmount(period);

        for (const priceInfo of priceAmountInfo) {
            await this.result.findOneAndUpdate(
                {
                    period,
                    isCompleted: false,
                    gameType: priceInfo._id
                },
                {
                    price: priceInfo.price,
                }
            );
        }
    }

    public async deleteRecords(): Promise<any> {

    }

    public async setResult(setResultBody: SetResultBody): Promise<void> {
        const periodInfo: Result | null = await this.result.findOneAndUpdate(
            {
                gameType: setResultBody.gameType,
                period: setResultBody.period,
                isCompleted: false
            },
            {
                number: setResultBody.number,
                color: combinations[setResultBody.number].colors,
                isSet: true,
            },
            {
                new: true
            }
        ).lean();

        if (!periodInfo) {
            throw new HttpException(statusCode.NOT_FOUND, "Period Expired!");
        }
    }

    public async getCurrentResult(period: number) {

        let allGameResultBoardList: Array<any> = [];
        const allGamesResult: Array<Result> = await ResultModel.find(
            {
                period,
                isCompleted: false
            }
        )
            .lean();

        for (const gameResult of allGamesResult) {
            let gameBoard: Array<InitGameBoard> = [
                {
                    // 0
                    number: 0,
                    color: [colors.violet, colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 1
                    number: 1,
                    color: [colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 2
                    number: 2,
                    color: [colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 3
                    number: 3,
                    color: [colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 4
                    number: 4,
                    color: [colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 5
                    number: 5,
                    color: [colors.violet, colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 6
                    number: 6,
                    color: [colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 7
                    number: 7,
                    color: [colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 8
                    number: 8,
                    color: [colors.red],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
                {
                    // 9
                    number: 9,
                    color: [colors.green],
                    betAmount: 0,
                    loss: 0,
                    lossAmount: 0,
                    earnAmount: 0
                },
            ];
            let gameBetTotalAmount = 0;
            let finalResult: any;

            const numberBetTotal: Array<NumberBetTotal> = await RecordModel.aggregate([
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

            numberBetTotal.forEach((numberBetInfo: NumberBetTotal) => {
                let index = numberBetInfo._id;

                if (index != null && index >= 0) {
                    gameBetTotalAmount += numberBetInfo.totalAmount;
                    gameBoard[index].betAmount += numberBetInfo.totalAmount;
                    gameBoard[index].lossAmount += numberBetInfo.totalAmount * 9;
                }
            });

            const colorBetTotal: Array<ColorBetTotal> = await RecordModel.aggregate([
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

            colorBetTotal.forEach((colorBetInfo: ColorBetTotal) => {
                let index: string = colorBetInfo._id as unknown as string;

                if (index && colorCombo[index]) {
                    gameBetTotalAmount += colorBetInfo.totalAmount;
                    colorCombo[index].forEach(({ number, price }: any) => {
                        gameBoard[number].betAmount += colorBetInfo.totalAmount;
                        gameBoard[number].lossAmount += colorBetInfo.totalAmount * price;
                    })
                }
            });

            gameBoard.forEach((combo: InitGameBoard) => {
                if (gameBetTotalAmount) {
                    combo.loss = (combo.lossAmount / gameBetTotalAmount) * 100;
                }
                combo.earnAmount = gameBetTotalAmount - combo.lossAmount;
            })

            finalResult = {
                color: gameResult.color,
                number: gameResult.number
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

    public async resultDeclaration(period: number) {
        try {
            const resultIds: Array<Result> = await this.findResultsByPeriod(period);

            if (resultIds.length == 0) {
                throw new HttpException(statusCode.NOT_FOUND, "Results not found!");
            }

            for (const result of resultIds) {
                await this.resultDeclarationPerGame(result)
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async resultDeclarationPerGame(result: Result) {
        const number: number = result.number;
        const colorsPrice = priceCombo[number];
        let priceAmount: number = 0;

        if (result.isSet) {
            const winners: RecordDoc[] = await RecordModel.find({
                result: result._id,
                isCompleted: false,
                status: recordStatus.pending,
                number
            });

            let winnerPromises: Array<any> = [];

            for (const winner of winners) {
                priceAmount += winner.amount * 9;

                winner.isCompleted = true;
                winner.status = recordStatus.success;
                winner.price = winner.amount * 9;

                winnerPromises.push(
                    winner.save(),
                    UserModel.findOneAndUpdate(
                        {
                            _id: winner.user
                        },
                        {
                            $inc: {
                                balance: winner.amount * 9
                            }
                        }
                    )
                );
            }

            for (const colorPrice of colorsPrice) {
                const { color, price } = colorPrice;

                const winners: RecordDoc[] = await RecordModel.find({
                    isCompleted: false,
                    result: result._id,
                    status: recordStatus.pending,
                    color
                });

                for (const winner of winners) {
                    priceAmount += winner.amount * price;

                    winner.isCompleted = true;
                    winner.status = recordStatus.success;
                    winner.price = winner.amount * price;

                    winnerPromises.push(
                        winner.save(),
                        UserModel.findOneAndUpdate(
                            {
                                _id: winner.user
                            },
                            {
                                $inc: {
                                    balance: winner.amount * price
                                }
                            }
                        )
                    );
                }
            }

            // update all promises at a time
            await Promise.all(winnerPromises);

            await RecordModel.updateMany(
                {
                    result: result._id,
                    isCompleted: false,
                    status: recordStatus.pending,
                },
                {
                    status: recordStatus.failed,
                    isCompleted: true
                }
            );

            await this.result.updateOne(
                {
                    _id: result._id,
                    isCompleted: false
                },
                {
                    isCompleted: true,
                    price: priceAmount,
                    earnAmount: result.amount - priceAmount
                }
            );
        } else {
            await recordsService.updateWinnerBetByNumber(result._id!, number, 9);

            for (const colorPrice of colorsPrice) {
                const { color, price } = colorPrice;
                await recordsService.updateWinnerBetByColor(result._id!, color, price);
            }

            await RecordModel.updateMany(
                {
                    result: result._id,
                    isCompleted: false,
                    status: recordStatus.pending,
                },
                {
                    status: recordStatus.failed,
                    isCompleted: true
                }
            );

            await this.result.updateOne(
                {
                    _id: result._id,
                    isCompleted: false
                },
                {
                    isCompleted: true
                }
            );
        }
    }

    public async getTotalBetAmount(): Promise<number> {
        const betAmountData: any = await this.result.aggregate([
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

    public async getTotalEarning(): Promise<any> {
        const totalEarningData: any = await this.result.aggregate([
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

    public async getTotalPrize(): Promise<any> {
        const totalPrizeData: any = await this.result.aggregate([
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

    public async getDashBoardData(): Promise<any> {
        const totalBetAmount: number = await this.getTotalBetAmount();
        const totalEarning: number = await this.getTotalEarning();
        const totalPrize: number = await this.getTotalPrize();
        const totalUser: number = await usersService.userCount();

        return {
            totalBetAmount,
            totalEarning,
            totalPrize,
            totalUser
        }
    }

    public async getTwoDaysAgoResults(twoDayAgoDate: Date): Promise<Array<Types.ObjectId>> {
        const ids: Types.ObjectId[] = await this.result.find({
            createdAt: {
                $lt: twoDayAgoDate
            }
        }).transform((doc) => {
            return doc.map((element: any) => element._id);
        });

        return ids;
    }

    public async deleteResults(): Promise<any> {
        const date: Date = new Date();
        const twoDayAgoDate: Date = new Date(date.getTime() - 24 * 60 * 60 * 1000 * 2);
        const ids: Array<Types.ObjectId> = await this.getTwoDaysAgoResults(twoDayAgoDate);

        await recordsService.deleteRecords(ids);

        await this.result.deleteMany({
            createdAt: {
                $lt: twoDayAgoDate
            }
        });
    }
}

export default ResultsService.getInstance();
