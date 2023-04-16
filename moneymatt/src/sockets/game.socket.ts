import { Server } from "socket.io";
import { Types } from "mongoose";

import { SocketWithUser } from "../common/auth/auth.interface";
import { NEW_PERIOD, NEW_RECORD, NEW_YANTRA_PERIOD, NEW_YANTRA_RECORD, recordEventEmitter, resultEventEmitter, yantraRecordEventEmitter, yantraResultEventEmitter } from "../events/emitter";
import { UserDoc } from "../common/users/users.interface";
import socketAuthMiddleware from "../middlewares/socketAuth.middleware";
import recordsService from "../consumer/records/records.service";
import yantraRecordsService from "../consumer/yantraRecords/yantraRecords.service";

export function gameSocket(io: Server) {
    io.use(async (socket: SocketWithUser, next: Function) => {
        try {
            const userInfo: UserDoc | undefined = await socketAuthMiddleware(socket.handshake.auth.Authorization, true);
            socket.user = userInfo!;

            socket.on("disconnect", () => {
                console.log("deleted socket");
                socket.disconnect();
            })

            next();
        }
        catch (error) {
            console.log(error);
            socket.disconnect();
            next(error);
        }
    })
        .on("connection", (socket: SocketWithUser) => {
            console.log("connected", socket.id);
        })

    resultEventEmitter.on(NEW_PERIOD, (data: any) => {
        try {
            io.emit(NEW_PERIOD, data);
        }
        catch (error) {
            console.log(error);
        }
    });

    recordEventEmitter.on(NEW_RECORD, async (periodId: Types.ObjectId, period: number) => {
        try {
            const result = await recordsService.sendResultToSocket(periodId, period);
            io.emit(NEW_RECORD, result);
        }
        catch (error) {
            console.log(error);
        }
    });

    yantraResultEventEmitter.on(NEW_YANTRA_PERIOD, (data: any) => {
        try {
            io.emit(NEW_YANTRA_PERIOD, data);
        }
        catch (error) {
            console.log(error);
        }
    });

    yantraRecordEventEmitter.on(NEW_YANTRA_RECORD, async (periodId: Types.ObjectId, period: number) => {
        try {
            const result = await yantraRecordsService.sendResultToSocket(periodId, period);
            io.emit(NEW_YANTRA_RECORD, result);
        }
        catch (error) {
            console.log(error);
        }
    });
}