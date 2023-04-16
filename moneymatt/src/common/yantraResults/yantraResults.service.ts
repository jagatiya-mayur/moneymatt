import { Types } from "mongoose";

import { recordStatus, statusCode, yantra, yantras } from "../../utils/globalConst";
import HttpException from "../../exceptions/HttpException";
import { getYantraPeriod, randomInRange } from "../../utils/utils";

import { NEW_YANTRA_PERIOD, yantraResultEventEmitter } from "../../events/emitter";
import { YantraResult, ResultGetQuery, SetResultBody } from "./yantraResults.interface";
import { YantraRecordDoc } from "../../consumer/yantraRecords/yantraRecords.interface";

import usersService from "../users/users.service";
import yantraRecordsService from "../../consumer/yantraRecords/yantraRecords.service";

import yantraRecordModel from "../../consumer/yantraRecords/yantraRecords.model";
import yantraResultModel from "./yantraResults.model";
import UserModel from "../users/users.model";

let instance: null | YantraResultsService = null;

class YantraResultsService {
    private yantraResult = yantraResultModel;

    static getInstance(): YantraResultsService {
        if (instance == null) {
            instance = new YantraResultsService();
        }

        return instance;
    }

    public async getPeriodInfo(period: number) {
        return await this.yantraResult.findOne({
            period
        });
    }

    public async currentPeriod(): Promise<any> {
        const date: Date = new Date();
        const period = getYantraPeriod(date);

        return await this.yantraResult.findOne({
            period,
        })
            .lean()
            .select("period startTime endTime");
    }

    public async initializeResult(period: number, date: Date) {
        const isResultData: YantraResult | null = await this.yantraResult.findOne({ period, isDeleted: false }).lean();
        let periodInfo: any;

        if (isResultData) {
            periodInfo = {
                period,
                startTime: date,
                endTime: (Number(date) + 5 * 60 * 1000)
            }
        } else {
            const randomBetween09 = randomInRange(0, 9);
            periodInfo = {
                period,
                startTime: date,
                endTime: (Number(date) + 5 * 60 * 1000),
            }
            await this.yantraResult.create({
                ...periodInfo,
                yantra: yantras[randomBetween09]
            });
        }

        yantraResultEventEmitter.emit(NEW_YANTRA_PERIOD, periodInfo);
    }

    public async initializeFutureResult(period: number, date: Date) {
        const randomBetween09 = randomInRange(0, 9);
        const periodInfo = {
            period,
            startTime: (Number(date) + 5 * 60 * 1000),
            endTime: (Number(date) + 10 * 60 * 1000),
            yantra: yantras[randomBetween09]
        }

        await this.yantraResult.create(periodInfo);
    }


    public async findIdsByPeriod(period: number): Promise<Array<Types.ObjectId>> {
        const ids: Types.ObjectId[] = await this.yantraResult.find({
            period
        }).transform((doc) => {
            return doc.map((element: any) => element._id);
        });

        return ids;
    }

    public async findResultByPeriod(period: number): Promise<YantraResult | null> {
        return await this.yantraResult.findOne({
            period,
            $isDeleted: false
        }).lean();
    }

    public async getResultById(_id: Types.ObjectId): Promise<YantraResult> {
        return await this.yantraResult.findById(_id).lean();
    }

    public async checkResult(_id: Types.ObjectId): Promise<YantraResult> {
        const resultInfo: YantraResult = await this.getResultById(_id);

        if (!resultInfo) {
            throw new HttpException(statusCode.BAD_REQUEST, "Invalid resultId");
        }

        if (resultInfo.isCompleted) {
            throw new HttpException(statusCode.NOT_FOUND, "Period Expired!");
        }

        return resultInfo
    }

    public async getResults(resultGetQuey: ResultGetQuery) {
        const { page } = resultGetQuey;
        const recordPerPage = 10;
        const resultsCount: number = await this.yantraResult.find(
            {
                isCompleted: true
            }
        )
            .sort({ createdAt: -1 })
            .limit(480)
            .count();

        const results: YantraResult[] = await this.yantraResult.find(
            {
                isCompleted: true
            },
            {
                period: 1,
                openPrice: 1,
                yantra: 1,
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

        const results: YantraResult[] = await this.yantraResult.find(
            {
                isCompleted: true
            },
            {
                period: 1,
                openPrice: 1,
                yantra: 1,
                betAmount: 1,
                earnAmount: 1
            }
        )
            .lean()
            .sort({ createdAt: -1 })
            .limit(480);

        return results;
    }

    public async updateRsulttoComplete(period: number): Promise<any> {
        await this.yantraResult.updateMany(
            {
                period,
                isCompleted: false
            },
            {
                isCompleted: true
            }
        );
    }

    public async deleteRecords(): Promise<any> {

    }

    public async setResult(setResultBody: SetResultBody): Promise<void> {
        const periodInfo: YantraResult | null = await this.yantraResult.findOneAndUpdate(
            {
                period: setResultBody.period,
                isCompleted: false
            },
            {
                yantra: setResultBody.yantra,
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
        let totalBetAmount = 0;
        const gamesResult: YantraResult = await yantraResultModel.findOne(
            {
                period,
                isCompleted: false
            }
        )
            .lean();

        let gameBoard: Array<any> = [
            {
                // 0
                yantra: yantra.shree,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 1
                yantra: yantra.vashikaran,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 2
                yantra: yantra.sudarshan,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 3
                yantra: yantra.vastu,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 4
                yantra: yantra.planet,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 5
                yantra: yantra.love,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 6
                yantra: yantra.tara,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 7
                yantra: yantra.grah,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 8
                yantra: yantra.matsya,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
            {
                // 9
                yantra: yantra.meditation,
                betAmount: 0,
                loss: 0,
                lossAmount: 0,
                earnAmount: 0
            },
        ];

        const totalBet: Array<any> = await yantraRecordsService.getTotalBetsPerYantra(gamesResult._id!);

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

        return {
            finalResult: gamesResult.yantra,
            totalBetAmount: totalBetAmount,
            gameBoard
        };

    }

    public async resultDeclaration(period: number) {
        try {
            const periodResult: YantraResult | null = await this.findResultByPeriod(period);

            if (!periodResult) {
                throw new HttpException(statusCode.NOT_FOUND, "Results not found!");
            }

            await this.resultDeclarationPerGame(periodResult);

        } catch (error) {
            console.log(error);
        }
    }

    private async resultDeclarationPerGame(result: YantraResult) {
        const yantra: string = result.yantra;
        let priceAmount: number = 0;

        const winners: Array<YantraRecordDoc> = await yantraRecordModel.find({
            result: result._id,
            isCompleted: false,
            status: recordStatus.pending,
            select: yantra
        });

        const winnerPromises: Array<any> = [];
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
        await Promise.all(winnerPromises);

        await yantraRecordModel.updateMany(
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

        await this.yantraResult.updateMany(
            {
                _id: result._id,
                isCompleted: false
            },
            {
                isCompleted: true,
                openPrice: priceAmount,
                earnAmount: (result.betAmount - priceAmount)
            }
        );
    }

    public async getTotalBetAmount(): Promise<number> {
        const betAmountData: any = await this.yantraResult.aggregate([
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

    public async getTotalEarning(): Promise<any> {
        const totalEarningData: any = await this.yantraResult.aggregate([
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
        const totalPrizeData: any = await this.yantraResult.aggregate([
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
        const ids: Types.ObjectId[] = await this.yantraResult.find({
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

        await yantraRecordsService.deleteRecords(ids);

        await this.yantraResult.deleteMany({
            createdAt: {
                $lt: twoDayAgoDate
            }
        });
    }
}

export default YantraResultsService.getInstance();
