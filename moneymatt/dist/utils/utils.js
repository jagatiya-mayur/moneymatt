"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferalCode = exports.randomInRange = exports.stringToNumber = exports.twoPerOfValue = exports.deduct2Per = exports.getYantraPeriod = exports.getPeriod = exports.shortCode = exports.responseHandler = void 0;
const date_fns_1 = require("date-fns");
const responseHandler = (data, statusCode, message, hasError) => {
    return {
        statusCode: statusCode || 200,
        hasError: hasError || false,
        data,
        message: message || '',
    };
};
exports.responseHandler = responseHandler;
const shortCode = () => {
    const min = 10000;
    const max = 90000;
    const shortCode = Math.floor(Math.random() * min) + max;
    return shortCode;
};
exports.shortCode = shortCode;
function getValidMonth(date) {
    return `${(0, date_fns_1.getMonth)(date) < 9 ? "0" : ""}${(0, date_fns_1.getMonth)(date) + 1}`;
}
function getValidDate(date) {
    return `${(0, date_fns_1.getDate)(date) < 10 ? "0" : ""}${(0, date_fns_1.getDate)(date)}`;
}
function getValidTurn(date) {
    const turn = Math.floor(((0, date_fns_1.getHours)(date) * 60 + (0, date_fns_1.getMinutes)(date)) / 3);
    if (turn < 10) {
        return `00${turn}`;
    }
    else if (turn < 100) {
        return `0${turn}`;
    }
    else {
        return turn;
    }
}
function getValidYantraTurn(date) {
    const turn = Math.floor(((0, date_fns_1.getHours)(date) * 60 + (0, date_fns_1.getMinutes)(date)) / 5);
    if (turn < 10) {
        return `00${turn}`;
    }
    else if (turn < 100) {
        return `0${turn}`;
    }
    else {
        return turn;
    }
}
const getPeriod = (date) => {
    const period = Number(`${(0, date_fns_1.getYear)(date)}${getValidMonth(date)}${getValidDate(date)}${getValidTurn(date)}`);
    return period;
};
exports.getPeriod = getPeriod;
const getYantraPeriod = (date) => {
    const period = Number(`${(0, date_fns_1.getYear)(date)}${getValidMonth(date)}${getValidDate(date)}${getValidYantraTurn(date)}`);
    return period;
};
exports.getYantraPeriod = getYantraPeriod;
const deduct2Per = (value) => {
    value = Number(value);
    return value - value * 0.02;
};
exports.deduct2Per = deduct2Per;
const twoPerOfValue = (value) => {
    value = Number(value);
    return value * 0.02;
};
exports.twoPerOfValue = twoPerOfValue;
const stringToNumber = (value) => {
    return Number(value);
};
exports.stringToNumber = stringToNumber;
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomInRange = randomInRange;
function generateReferalCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateReferalCode = generateReferalCode;
//# sourceMappingURL=utils.js.map