"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEW_YANTRA_RECORD = exports.NEW_YANTRA_PERIOD = exports.yantraRecordEventEmitter = exports.yantraResultEventEmitter = exports.NEW_RECORD = exports.NEW_PERIOD = exports.recordEventEmitter = exports.resultEventEmitter = void 0;
const events_1 = require("events");
exports.resultEventEmitter = new events_1.EventEmitter();
exports.recordEventEmitter = new events_1.EventEmitter();
exports.NEW_PERIOD = "newPeriod";
exports.NEW_RECORD = "newRecord";
exports.yantraResultEventEmitter = new events_1.EventEmitter();
exports.yantraRecordEventEmitter = new events_1.EventEmitter();
exports.NEW_YANTRA_PERIOD = "newYantraPeriod";
exports.NEW_YANTRA_RECORD = "newYantraRecord";
//# sourceMappingURL=emitter.js.map