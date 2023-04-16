"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSocket = void 0;
const emitter_1 = require("../events/emitter");
const socketAuth_middleware_1 = __importDefault(require("../middlewares/socketAuth.middleware"));
const records_service_1 = __importDefault(require("../consumer/records/records.service"));
const yantraRecords_service_1 = __importDefault(require("../consumer/yantraRecords/yantraRecords.service"));
function gameSocket(io) {
    io.use(async (socket, next) => {
        try {
            const userInfo = await (0, socketAuth_middleware_1.default)(socket.handshake.auth.Authorization, true);
            socket.user = userInfo;
            socket.on("disconnect", () => {
                console.log("deleted socket");
                socket.disconnect();
            });
            next();
        }
        catch (error) {
            console.log(error);
            socket.disconnect();
            next(error);
        }
    })
        .on("connection", (socket) => {
        console.log("connected", socket.id);
    });
    emitter_1.resultEventEmitter.on(emitter_1.NEW_PERIOD, (data) => {
        try {
            io.emit(emitter_1.NEW_PERIOD, data);
        }
        catch (error) {
            console.log(error);
        }
    });
    emitter_1.recordEventEmitter.on(emitter_1.NEW_RECORD, async (periodId, period) => {
        try {
            const result = await records_service_1.default.sendResultToSocket(periodId, period);
            io.emit(emitter_1.NEW_RECORD, result);
        }
        catch (error) {
            console.log(error);
        }
    });
    emitter_1.yantraResultEventEmitter.on(emitter_1.NEW_YANTRA_PERIOD, (data) => {
        try {
            io.emit(emitter_1.NEW_YANTRA_PERIOD, data);
        }
        catch (error) {
            console.log(error);
        }
    });
    emitter_1.yantraRecordEventEmitter.on(emitter_1.NEW_YANTRA_RECORD, async (periodId, period) => {
        try {
            const result = await yantraRecords_service_1.default.sendResultToSocket(periodId, period);
            io.emit(emitter_1.NEW_YANTRA_RECORD, result);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.gameSocket = gameSocket;
//# sourceMappingURL=game.socket.js.map