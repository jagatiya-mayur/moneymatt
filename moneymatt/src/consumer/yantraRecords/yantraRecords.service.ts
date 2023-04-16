import { Types } from "mongoose";

import { recordStatus, statusCode, yantra, yantras } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";

import yantraRecordModel from "./yantraRecords.model";
import yantraResultsService from "../../common/yantraResults/yantraResults.service";
import { deduct2Per, twoPerOfValue } from "../../utils/utils";
import { NewRecord, YantraRecord, RecordQuery } from "./yantraRecords.interface";
import usersService from "../../common/users/users.service";
import { User } from "../../common/users/users.interface";
import { YantraResult } from "../../common/yantraResults/yantraResults.interface";
import yantraResultModel from "../../common/yantraResults/yantraResults.model";
import { NEW_YANTRA_RECORD, yantraRecordEventEmitter } from "../../events/emitter";
import PricePercentageModel from "../../admin/yantraPricePercentage/pricePercentage.model";
import { PricePercentage } from "../../admin/pricePercentage/pricePercentage.interface";

let instance: null | YantraRecordsService = null;

class YantraRecordsService {
    private yantraRecord = yantraRecordModel;

    static getInstance(): YantraRecordsService {
        if (instance == null) {
            instance = new YantraRecordsService();
        }

        return instance;
    }

    public async getRecorById(id: Types.ObjectId): Promise<any> {
        return await this.yantraRecord.findOne(
            {
                _id: id
            }
        )
            .select("contractMoney amount fee status createdAt yantra")
    }

    public async newRecord(userId: Types.ObjectId, newRecordInfo: NewRecord) {
        const periodInfo: YantraResult = await yantraResultsService.checkResult(newRecordInfo.periodId);

        const amount: number = deduct2Per(newRecordInfo.contractMoney);

        const newRecord = await this.yantraRecord.create({
            user: userId,
            result: newRecordInfo.periodId,
            contractMoney: newRecordInfo.contractMoney,
            fee: twoPerOfValue(newRecordInfo.contractMoney),
            amount,
            select: newRecordInfo.yantra
        });

        await yantraResultModel.findByIdAndUpdate(
            periodInfo._id,
            {
                $inc: {
                    betAmount: amount
                }
            }
        )
        const user: User = await usersService.deductBalance(userId, newRecordInfo.contractMoney);

        // event emitter 
        yantraRecordEventEmitter.emit(NEW_YANTRA_RECORD, periodInfo._id, periodInfo.period);

        return {
            record: await this.getRecorById(newRecord._id),
            balance: user.balance
        };
    }

    public async getRecordsByColor(gameType: string, period: number, color: string): Promise<Array<YantraRecord>> {
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

    public async getRecordsByNumber(gameType: string, period: number, number: number): Promise<Array<YantraRecord>> {
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

    public async getRecordsPerPage(recordQuery: RecordQuery, userId: Types.ObjectId) {
        const { page } = recordQuery;
        const recordPerPage: number = 10;

        const recordCount: any = await this.yantraRecord.aggregate([
            {
                '$match': {
                    'user': new Types.ObjectId(userId)
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

        let records: YantraRecord[] | Array<any> = await this.yantraRecord.aggregate([
            {
                '$match': {
                    'user': new Types.ObjectId(userId)
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

        records = records.map((record: YantraRecord | any) => {
            return {
                _id: record._id,
                contractMoney: record.contractMoney,
                select: record.select,
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

    public async updateFailedBet(period: number) {
        const resultIds: Types.ObjectId[] = await yantraResultsService.findIdsByPeriod(period);

        await this.yantraRecord.updateMany(
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

    public async sendResultToSocket(periodId: Types.ObjectId, period: number): Promise<any> {
        let totalBetAmount = 0;
        let finalResult: any;
        const gameResult: YantraResult = await yantraResultModel.findOne(
            {
                period,
                isCompleted: false
            }
        )
            .lean();

        // for (const gameResult of allGamesResult) {
        let gameBoard: Array<any> = [
            {
                // 0
                number: 0,
                yantra: yantra.shree,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 1
                number: 1,
                yantra: yantra.vashikaran,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 2
                number: 2,
                yantra: yantra.sudarshan,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 3
                number: 3,
                yantra: yantra.vastu,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 4
                number: 4,
                yantra: yantra.planet,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 5
                number: 5,
                yantra: yantra.love,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 6
                number: 6,
                yantra: yantra.tara,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 7
                number: 7,
                yantra: yantra.grah,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 8
                number: 8,
                yantra: yantra.matsya,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 9
                number: 9,
                yantra: yantra.meditation,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
        ];

        const totalBet: Array<any> = await this.getTotalBetsPerYantra(gameResult._id!);

        totalBet.forEach((yantraBetInfo: any) => {
            let yantra = yantraBetInfo._id;
            const index = yantras.findIndex((data: string) => data === yantra);

            totalBetAmount += yantraBetInfo.totalAmount;
            gameBoard[index].betAmount += yantraBetInfo.totalAmount;
            gameBoard[index].lossAmount += yantraBetInfo.totalAmount * 9;
        });

        gameBoard.forEach((combo: any) => {
            if (totalBetAmount) {
                combo.loss = (combo.lossAmount / totalBetAmount) * 100;
            }
            combo.earnAmount = totalBetAmount - combo.lossAmount;
        })

        if (gameResult.isSet) {
            finalResult = gameResult.yantra;
            const index = yantras.findIndex((data: string) => data === finalResult);

            await yantraResultModel.findByIdAndUpdate(
                gameResult._id,
                {
                    openPrice: gameBoard[index].lossAmount,
                    earnAmount: gameBoard[index].earnAmount,
                }
            );
        }
        else {
            let priceMoney: any;
            let earnAmount: any;
            const pricePer: PricePercentage = await PricePercentageModel.findOne().lean();
            gameBoard.sort((a, b) => b.loss - a.loss);

            for (const combo of gameBoard) {
                if (combo.loss <= pricePer.giveAwayPer) {
                    finalResult = combo.yantra;

                    // lossAmount will become priceMoney 
                    priceMoney = combo.lossAmount;
                    earnAmount = combo.earnAmount;
                    break;
                }
            }

            if (!finalResult) {
                finalResult = gameBoard[9].yantra

                // lossAmount will become priceMoney 
                priceMoney = gameBoard[9].lossAmount;
                earnAmount = gameBoard[9].earnAmount;
            }

            await yantraResultModel.findByIdAndUpdate(
                gameResult._id,
                {
                    // openPrice: priceMoney!,
                    // earnAmount: earnAmount!,
                    yantra: finalResult
                }
            );

            gameBoard.sort((a, b) => a.number - b.number);
        }

        return {
            finalResult,
            totalBetAmount,
            gameBoard
        }
    }

    public async getTotalBetAmount(): Promise<number> {
        const betAmountData: any = await this.yantraRecord.aggregate([
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
        await this.yantraRecord.deleteMany({
            result: {
                $in: resultIds
            }
        });
    }

    public async getTotalBetsPerYantra(resultId: Types.ObjectId): Promise<any> {
        return await this.yantraRecord.aggregate([
            {
                '$match': {
                    'result': new Types.ObjectId(resultId)
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

    public async yantraRecodsAmountInfo(userIds: Types.ObjectId[]): Promise<any> {
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
        ])
    }
}

export default YantraRecordsService.getInstance();