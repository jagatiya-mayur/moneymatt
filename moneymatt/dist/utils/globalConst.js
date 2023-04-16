"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yantras = exports.yantra = exports.priceCombo = exports.combinations = exports.numberCombinations = exports.colorCombo = exports.games = exports.accountTypes = exports.queryStatus = exports.gameTypes = exports.recordStatus = exports.transactionStatus = exports.colors = exports.status = exports.withdrawStatus = exports.paymentStatus = exports.otpType = exports.role = exports.statusCode = void 0;
exports.statusCode = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    EARLYHINTS: 103,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    AMBIGUOUS: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    I_AM_A_TEAPOT: 418,
    MISDIRECTED: 421,
    UNPROCESSABLE_ENTITY: 422,
    FAILED_DEPENDENCY: 424,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505
};
var role;
(function (role) {
    role["admin"] = "admin";
    role["user"] = "user";
})(role = exports.role || (exports.role = {}));
;
var otpType;
(function (otpType) {
    otpType["signUp"] = "signUp";
    otpType["forgotPassword"] = "forgotPassword";
    otpType["signIn"] = "signIn";
})(otpType = exports.otpType || (exports.otpType = {}));
;
var paymentStatus;
(function (paymentStatus) {
    paymentStatus["pending"] = "pending";
    paymentStatus["success"] = "success";
    paymentStatus["failed"] = "failed";
})(paymentStatus = exports.paymentStatus || (exports.paymentStatus = {}));
;
var withdrawStatus;
(function (withdrawStatus) {
    withdrawStatus["pending"] = "pending";
    withdrawStatus["success"] = "success";
    withdrawStatus["failed"] = "failed";
})(withdrawStatus = exports.withdrawStatus || (exports.withdrawStatus = {}));
;
var status;
(function (status) {
    status["active"] = "active";
    status["inactive"] = "inactive";
})(status = exports.status || (exports.status = {}));
;
var colors;
(function (colors) {
    colors["green"] = "green";
    colors["violet"] = "violet";
    colors["red"] = "red";
})(colors = exports.colors || (exports.colors = {}));
;
var transactionStatus;
(function (transactionStatus) {
    transactionStatus["success"] = "TXN_SUCCESS";
    transactionStatus["failure"] = "TXN_FAILURE";
})(transactionStatus = exports.transactionStatus || (exports.transactionStatus = {}));
;
var recordStatus;
(function (recordStatus) {
    recordStatus["pending"] = "wait";
    recordStatus["success"] = "success";
    recordStatus["failed"] = "fail";
})(recordStatus = exports.recordStatus || (exports.recordStatus = {}));
;
var gameTypes;
(function (gameTypes) {
    gameTypes["Parity"] = "Parity";
    gameTypes["Sapre"] = "Sapre";
    gameTypes["Bcone"] = "Bcone";
    gameTypes["Emerd"] = "Emerd";
})(gameTypes = exports.gameTypes || (exports.gameTypes = {}));
;
var queryStatus;
(function (queryStatus) {
    queryStatus["pending"] = "pending";
    queryStatus["resolved"] = "resolved";
})(queryStatus = exports.queryStatus || (exports.queryStatus = {}));
var accountTypes;
(function (accountTypes) {
    accountTypes["bank_account"] = "bank_account";
    accountTypes["vpa"] = "vpa";
})(accountTypes = exports.accountTypes || (exports.accountTypes = {}));
exports.games = [gameTypes.Parity, gameTypes.Sapre, gameTypes.Bcone, gameTypes.Emerd];
exports.colorCombo = {
    green: [
        {
            number: 1,
            price: 2
        },
        {
            number: 3,
            price: 2
        },
        {
            number: 7,
            price: 2
        },
        {
            number: 9,
            price: 2
        },
        {
            number: 5,
            price: 1.5
        }
    ],
    red: [
        {
            number: 2,
            price: 2
        },
        {
            number: 4,
            price: 2
        },
        {
            number: 6,
            price: 2
        },
        {
            number: 8,
            price: 2
        },
        {
            number: 0,
            price: 1.5
        }
    ],
    violet: [
        {
            number: 0,
            price: 4.5
        },
        {
            number: 5,
            price: 4.5
        },
    ]
};
exports.numberCombinations = [
    {
        number: 0,
        colors: [colors.violet, colors.red],
        price: 9
    },
    {
        number: 1,
        colors: [colors.green],
        price: 9
    },
    {
        number: 2,
        colors: [colors.red],
        price: 9
    },
    {
        number: 3,
        colors: [colors.green],
        price: 9
    },
    {
        number: 4,
        colors: [colors.red],
        price: 9
    },
    {
        number: 5,
        colors: [colors.violet, colors.green],
        price: 9
    },
    {
        number: 6,
        colors: [colors.red],
        price: 9
    },
    {
        number: 7,
        colors: [colors.green],
        price: 9
    },
    {
        number: 8,
        colors: [colors.red],
        price: 9
    },
    {
        number: 9,
        colors: [colors.green],
        price: 9
    }
];
exports.combinations = [
    {
        colors: [colors.violet, colors.red]
    },
    {
        colors: [colors.green]
    },
    {
        colors: [colors.red]
    },
    {
        colors: [colors.green]
    },
    {
        colors: [colors.red]
    },
    {
        colors: [colors.violet, colors.green]
    },
    {
        colors: [colors.red]
    },
    {
        colors: [colors.green]
    },
    {
        colors: [colors.red]
    },
    {
        colors: [colors.green]
    },
];
exports.priceCombo = [
    [
        {
            color: colors.violet,
            price: 4.5
        },
        {
            color: colors.red,
            price: 1.5
        }
    ],
    [
        {
            color: colors.green,
            price: 2
        }
    ],
    [
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        {
            color: colors.green,
            price: 2
        }
    ],
    [
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        {
            color: colors.violet,
            price: 4.5
        },
        {
            color: colors.green,
            price: 1.5
        }
    ],
    [
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        {
            color: colors.green,
            price: 2
        }
    ],
    [
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        {
            color: colors.green,
            price: 2
        }
    ]
];
var yantra;
(function (yantra) {
    yantra["shree"] = "Shree";
    yantra["vashikaran"] = "Vashikaran";
    yantra["sudarshan"] = "Sudarshan";
    yantra["vastu"] = "Vastu";
    yantra["planet"] = "Planet";
    yantra["love"] = "Love";
    yantra["tara"] = "Tara";
    yantra["grah"] = "Grah";
    yantra["matsya"] = "Matsya";
    yantra["meditation"] = "Meditation";
})(yantra = exports.yantra || (exports.yantra = {}));
exports.yantras = [
    yantra.shree,
    yantra.vashikaran,
    yantra.sudarshan,
    yantra.vastu,
    yantra.planet,
    yantra.love,
    yantra.tara,
    yantra.grah,
    yantra.matsya,
    yantra.meditation
];
//# sourceMappingURL=globalConst.js.map