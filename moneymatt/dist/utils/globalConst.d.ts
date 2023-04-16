export declare const statusCode: {
    CONTINUE: number;
    SWITCHING_PROTOCOLS: number;
    PROCESSING: number;
    EARLYHINTS: number;
    OK: number;
    CREATED: number;
    ACCEPTED: number;
    NON_AUTHORITATIVE_INFORMATION: number;
    NO_CONTENT: number;
    RESET_CONTENT: number;
    PARTIAL_CONTENT: number;
    AMBIGUOUS: number;
    MOVED_PERMANENTLY: number;
    FOUND: number;
    SEE_OTHER: number;
    NOT_MODIFIED: number;
    TEMPORARY_REDIRECT: number;
    PERMANENT_REDIRECT: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    PAYMENT_REQUIRED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    METHOD_NOT_ALLOWED: number;
    NOT_ACCEPTABLE: number;
    PROXY_AUTHENTICATION_REQUIRED: number;
    REQUEST_TIMEOUT: number;
    CONFLICT: number;
    GONE: number;
    LENGTH_REQUIRED: number;
    PRECONDITION_FAILED: number;
    PAYLOAD_TOO_LARGE: number;
    URI_TOO_LONG: number;
    UNSUPPORTED_MEDIA_TYPE: number;
    REQUESTED_RANGE_NOT_SATISFIABLE: number;
    EXPECTATION_FAILED: number;
    I_AM_A_TEAPOT: number;
    MISDIRECTED: number;
    UNPROCESSABLE_ENTITY: number;
    FAILED_DEPENDENCY: number;
    PRECONDITION_REQUIRED: number;
    TOO_MANY_REQUESTS: number;
    INTERNAL_SERVER_ERROR: number;
    NOT_IMPLEMENTED: number;
    BAD_GATEWAY: number;
    SERVICE_UNAVAILABLE: number;
    GATEWAY_TIMEOUT: number;
    HTTP_VERSION_NOT_SUPPORTED: number;
};
export declare enum role {
    admin = "admin",
    user = "user"
}
export declare enum otpType {
    signUp = "signUp",
    forgotPassword = "forgotPassword",
    signIn = "signIn"
}
export declare enum paymentStatus {
    pending = "pending",
    success = "success",
    failed = "failed"
}
export declare enum withdrawStatus {
    pending = "pending",
    success = "success",
    failed = "failed"
}
export declare enum status {
    active = "active",
    inactive = "inactive"
}
export declare enum colors {
    green = "green",
    violet = "violet",
    red = "red"
}
export declare enum transactionStatus {
    success = "TXN_SUCCESS",
    failure = "TXN_FAILURE"
}
export declare enum recordStatus {
    pending = "wait",
    success = "success",
    failed = "fail"
}
export declare enum gameTypes {
    Parity = "Parity",
    Sapre = "Sapre",
    Bcone = "Bcone",
    Emerd = "Emerd"
}
export declare enum queryStatus {
    pending = "pending",
    resolved = "resolved"
}
export declare enum accountTypes {
    bank_account = "bank_account",
    vpa = "vpa"
}
export declare const games: gameTypes[];
export interface ColorCombination {
    green: Array<{
        number: number;
        price: number;
    }>;
    red: Array<{
        number: number;
        price: number;
    }>;
    violet: Array<{
        number: number;
        price: number;
    }>;
}
export interface NumberCombination {
    number: number;
    colors: string[];
    price: number;
}
export declare const colorCombo: any;
export declare const numberCombinations: NumberCombination[];
export interface Combinations {
    colors: Array<string>;
}
export declare const combinations: Array<Combinations>;
export interface InitGameBoard {
    number: number;
    color: Array<string>;
    betAmount: number;
    loss: number;
    lossAmount: number;
    earnAmount: number;
}
interface PriceCombo {
    color: string;
    price: number;
}
export declare const priceCombo: Array<Array<PriceCombo>>;
export declare enum yantra {
    shree = "Shree",
    vashikaran = "Vashikaran",
    sudarshan = "Sudarshan",
    vastu = "Vastu",
    planet = "Planet",
    love = "Love",
    tara = "Tara",
    grah = "Grah",
    matsya = "Matsya",
    meditation = "Meditation"
}
export declare const yantras: yantra[];
export {};
