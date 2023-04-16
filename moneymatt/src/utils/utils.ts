import { getDate, getHours, getMinutes, getMonth, getYear } from "date-fns";

/**
 * @method responseHandler
 * @param {Object | String | Array} data
 * @param {Number} statusCode
 * @param {String} message
 * @param {Boolean} hasError
 * @returns {Object}
 * @description ensures same response pattern for all APIs
 */
export const responseHandler = (
    data: object | string | number | object[] | null,
    statusCode?: number,
    message?: string,
    hasError?: boolean,
): object => {
    return {
        statusCode: statusCode || 200,
        hasError: hasError || false,
        data,
        message: message || '',
    };
};

export const shortCode = (): number => {
    const min = 10000;
    const max = 90000;
    const shortCode = Math.floor(Math.random() * min) + max;

    return shortCode
}

function getValidMonth(date: Date) {
    return `${getMonth(date) < 9 ? "0" : ""}${getMonth(date) + 1}`
}

function getValidDate(date: Date) {
    return `${getDate(date) < 10 ? "0" : ""}${getDate(date)}`
}

function getValidTurn(date: Date) {
    const turn = Math.floor((getHours(date) * 60 + getMinutes(date)) / 3);
    if (turn < 10) {
        return `00${turn}`
    } else if (turn < 100) {
        return `0${turn}`
    } else {
        return turn;
    }
}

function getValidYantraTurn(date: Date) {
    const turn = Math.floor((getHours(date) * 60 + getMinutes(date)) / 5);
    if (turn < 10) {
        return `00${turn}`
    } else if (turn < 100) {
        return `0${turn}`
    } else {
        return turn;
    }
}

export const getPeriod = (date: Date) => {
    const period = Number(`${getYear(date)}${getValidMonth(date)}${getValidDate(date)}${getValidTurn(date)}`);
    return period;
}

export const getYantraPeriod = (date: Date) => {
    const period = Number(`${getYear(date)}${getValidMonth(date)}${getValidDate(date)}${getValidYantraTurn(date)}`);
    return period;
}

export const deduct2Per = (value: number | number) => {
    value = Number(value);
    return value - value * 0.02;
}

export const twoPerOfValue = (value: string | number) => {
    value = Number(value);
    return value * 0.02;
}

export const stringToNumber = (value: string) => {
    return Number(value)
}

export function randomInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateReferalCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';

    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}