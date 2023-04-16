export const statusCode = {
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

export enum role {
    admin = "admin",
    user = "user",
};

export enum otpType {
    signUp = "signUp",
    forgotPassword = "forgotPassword",
    signIn = "signIn"
};

export enum paymentStatus {
    pending = "pending",
    success = "success",
    failed = "failed"
};

export enum withdrawStatus {
    pending = "pending",
    success = "success",
    failed = "failed"
};

export enum status {
    active = "active",
    inactive = "inactive"
};

export enum colors {
    green = "green",
    violet = "violet",
    red = "red"
};

export enum transactionStatus {
    success = "TXN_SUCCESS",
    failure = "TXN_FAILURE"
};

export enum recordStatus {
    pending = "wait",
    success = "success",
    failed = "fail"
};

export enum gameTypes {
    Parity = "Parity",
    Sapre = "Sapre",
    Bcone = "Bcone",
    Emerd = "Emerd"
};

export enum queryStatus {
    pending = "pending",
    resolved = "resolved"
}

export enum accountTypes {
    bank_account = "bank_account",
    vpa = "vpa"
}

export const games = [gameTypes.Parity, gameTypes.Sapre, gameTypes.Bcone, gameTypes.Emerd];

export interface ColorCombination {
    green: Array<{
        number: number,
        price: number
    }>,
    red: Array<{
        number: number,
        price: number
    }>,
    violet: Array<{
        number: number,
        price: number
    }>,
}

export interface NumberCombination {
    number: number;
    colors: string[];
    price: number;
}

export const colorCombo: any = {
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

export const numberCombinations: NumberCombination[] = [
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

export interface Combinations {
    colors: Array<string>
}

export const combinations: Array<Combinations> = [
    {
        // 0
        colors: [colors.violet, colors.red]
    },
    {
        // 1
        colors: [colors.green]
    },
    {
        // 2
        colors: [colors.red]
    },
    {
        // 3
        colors: [colors.green]
    },
    {
        // 4
        colors: [colors.red]
    },
    {
        // 5
        colors: [colors.violet, colors.green]
    },
    {
        // 6
        colors: [colors.red]
    },
    {
        // 7
        colors: [colors.green]
    },
    {
        // 8
        colors: [colors.red]
    },
    {
        // 9
        colors: [colors.green]
    },
];

export interface InitGameBoard {
    number: number;
    color: Array<string>,
    betAmount: number,
    loss: number,
    lossAmount: number,
    earnAmount: number
}

interface PriceCombo {
    color: string,
    price: number
}

export const priceCombo: Array<Array<PriceCombo>> = [
    [
        // 0 
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
        // 1
        {
            color: colors.green,
            price: 2
        }
    ],
    [
        // 2 
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        // 3
        {
            color: colors.green,
            price: 2
        }
    ],
    [
        // 4 
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        // 5
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
        // 6
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        // 7
        {
            color: colors.green,
            price: 2
        }
    ],
    [
        // 8
        {
            color: colors.red,
            price: 2
        }
    ],
    [
        // 9
        {
            color: colors.green,
            price: 2
        }
    ]
];

export enum yantra {
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

export const yantras = [
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