import { EventEmitter } from "events";

export const resultEventEmitter: EventEmitter = new EventEmitter();
export const recordEventEmitter: EventEmitter = new EventEmitter();

export const NEW_PERIOD: string = "newPeriod";
export const NEW_RECORD: string = "newRecord";

export const yantraResultEventEmitter: EventEmitter = new EventEmitter();
export const yantraRecordEventEmitter: EventEmitter = new EventEmitter();

export const NEW_YANTRA_PERIOD: string = "newYantraPeriod";
export const NEW_YANTRA_RECORD: string = "newYantraRecord";
