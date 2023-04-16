export declare const responseHandler: (data: object | string | number | object[] | null, statusCode?: number, message?: string, hasError?: boolean) => object;
export declare const shortCode: () => number;
export declare const getPeriod: (date: Date) => number;
export declare const getYantraPeriod: (date: Date) => number;
export declare const deduct2Per: (value: number | number) => number;
export declare const twoPerOfValue: (value: string | number) => number;
export declare const stringToNumber: (value: string) => number;
export declare function randomInRange(min: number, max: number): number;
export declare function generateReferalCode(): string;
