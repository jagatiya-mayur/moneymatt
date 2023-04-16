import { Types } from "mongoose";

import { colorCombo, colors, InitGameBoard, recordStatus, statusCode } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";

import recordModel from "./records.model";
import resultsService from "../../common/results/results.service";
import { deduct2Per, twoPerOfValue } from "../../utils/utils";
import { ColorBetTotal, NewRecord, NumberBetTotal, Record, RecordDoc, RecordQuery } from "./records.interface";
import usersService from "../../common/users/users.service";
import { User } from "../../common/users/users.interface";
import { Result } from "../../common/results/results.interface";
import ResultModel from "../../common/results/results.model";
import { NEW_RECORD, recordEventEmitter } from "../../events/emitter";
import PricePercentageModel from "../../admin/pricePercentage/pricePercentage.model";
import { PricePercentage } from "../../admin/pricePercentage/pricePercentage.interface";
import UserModel from "../../common/users/users.model";


let instance: null | RecordsService = null;

class RecordsService {
    private record = recordModel;

    static getInstance(): RecordsService {
        if (instance == null) {
            instance = new RecordsService();
        }

        return instance;
    }

    public async getRecorById(id: Types.ObjectId): Promise<any> {
        return await this.record.findOne(
            {
                _id: id
            }
        )
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

    public async newRecord(userId: Types.ObjectId, newRecordInfo: NewRecord) {
        const periodInfo: Result = await resultsService.checkResult(newRecordInfo.periodId);

        let number: number | undefined = newRecordInfo.number;
        let color: string | undefined = newRecordInfo.color;
        const amount: number = deduct2Per(newRecordInfo.contractMoney);

        const newRecord = await this.record.create({
            user: userId,
            result: newRecordInfo.periodId,
            contractMoney: newRecordInfo.contractMoney,
            fee: twoPerOfValue(newRecordInfo.contractMoney),
            ...(number != undefined && number >= 0 && { number }),
            ...(color && { color }),
            amount
        });

        await ResultModel.findByIdAndUpdate(
            periodInfo._id,
            {
                $inc: {
                    amount
                }
            }
        )
        const user: User = await usersService.deductBalance(userId, newRecordInfo.contractMoney);

        // event emitter 
        recordEventEmitter.emit(NEW_RECORD, periodInfo._id, periodInfo.period);

        return {
            record: await this.getRecorById(newRecord._id),
            balance: user.balance
        };
    }

    public async getRecordsByColor(gameType: string, period: number, color: string): Promise<Array<Record>> {
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

    public async getRecordsByNumber(gameType: string, period: number, number: number): Promise<Array<Record>> {
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

    public async getRecordsPerPage(recordQuery: RecordQuery, userId: Types.ObjectId) {
        const { game, page } = recordQuery;
        const recordPerPage: number = 10;

        const recordCount: any = await this.record.aggregate([
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

        let records: Record[] | Array<any> = await this.record.aggregate([
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

        records = records.map((record: Record | any) => {
            return {
                _id: record._id,
                contractMoney: record.contractMoney,
                select: record.color ? record.color : record.number?.toString(),
                amount: record.amount,
                price: record.status == recordStatus.success ? record.price : (record.status == recordStatus.failed ? -record.amount : 0),
                fee: record.fee,
                status: record.status,
                period: record.result.period,
                result: record.status == recordStatus.pending ? null : record.result,
                createdAt: record.createdAt!
            }
        });

        return {
            records,
            pageSize: recordPerPage,
            pageNum: page,
            totalPage: Math.ceil(recordCount.length / recordPerPage),
            totalResults: recordCount.length
        };
    }

    public async updateWinnerBetByColor(resultId: Types.ObjectId, color: string, price: number) {
        const winners: RecordDoc[] = await this.record.find({
            isCompleted: false,
            result: resultId,
            status: recordStatus.pending,
            color
        });
        let winnerPromises: Array<any> = [];

        for (const winner of winners) {
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

            // update all promises at a time
            await Promise.all(winnerPromises);
        }
    }

    public async updateWinnerBetByNumber(resultId: Types.ObjectId, number: number, price: number) {
        const winners: RecordDoc[] = await this.record.find({
            result: resultId,
            isCompleted: false,
            status: recordStatus.pending,
            number
        });
        let winnerPromises: Array<any> = [];

        for (const winner of winners) {
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

        await Promise.all(winnerPromises);
    }

    public async updateFailedBet(period: number) {
        const resultIds: Types.ObjectId[] = await resultsService.findIdsByPeriod(period);

        await this.record.updateMany(
            {
                isCompleted: false,
                status: recordStatus.pending,
                result: {
                    $in: resultIds
                }
            },
            {
                isCompleted: true,
                status: recordStatus.failed,
            }
        )
    }

    public async getTotalPriceAmount(period: number): Promise<any> {
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

    public async sendResultToSocket(periodId: Types.ObjectId, period: number): Promise<any> {
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
            let priceMoney: number;
            let earnAmount: number;
            const pricePer: PricePercentage = await PricePercentageModel.findOne().lean();
            const numberBetTotal: Array<NumberBetTotal> = await this.record.aggregate([
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

            const colorBetTotal: Array<ColorBetTotal> = await this.record.aggregate([
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

            if (gameResult._id?.toString() == periodId.toString()) {
                if (gameResult.isSet) {
                    finalResult = {
                        color: gameResult.color,
                        number: gameResult.number
                    }
                } else {
                    gameBoard.sort((a, b) => b.loss - a.loss);

                    for (const combo of gameBoard) {
                        if (combo.loss <= pricePer.giveAwayPer) {
                            finalResult = {
                                color: combo.color,
                                number: combo.number
                            }
                            // lossAmount will become priceMoney 
                            priceMoney = combo.lossAmount;
                            earnAmount = combo.earnAmount;
                            break;
                        }
                    }

                    if (!finalResult) {
                        finalResult = {
                            color: gameBoard[9].color,
                            number: gameBoard[9].number
                        }
                        // lossAmount will become priceMoney 
                        priceMoney = gameBoard[9].lossAmount;
                        earnAmount = gameBoard[9].earnAmount;
                    }

                    await ResultModel.findByIdAndUpdate(
                        gameResult._id,
                        {
                            number: finalResult.number,
                            color: finalResult.color,
                            price: priceMoney!,
                            earnAmount: earnAmount!
                        }
                    );

                    gameBoard.sort((a, b) => a.number - b.number);
                }
            } else {
                finalResult = {
                    color: gameResult.color,
                    number: gameResult.number
                }
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

    public async getTotalBetAmount(): Promise<number> {
        const betAmountData: any = await this.record.aggregate([
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

    public async deleteRecords(resultIds: Array<Types.ObjectId>): Promise<void> {
        await this.record.deleteMany({
            result: {
                $in: resultIds
            }
        });
    }

    public async buddiesRecodsAmountInfo(userIds: Types.ObjectId[]): Promise<any> {
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

export default RecordsService.getInstance();