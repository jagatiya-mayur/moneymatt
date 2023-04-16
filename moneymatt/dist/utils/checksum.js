"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genchecksumforrefund = exports.verifychecksumbystring = exports.verifychecksum = exports.genchecksumbystring = exports.genchecksum = void 0;
const crypt_1 = __importDefault(require("./crypt"));
const util_1 = __importDefault(require("util"));
const crypto_1 = __importDefault(require("crypto"));
function paramsToString(params, mandatoryflag) {
    var data = '';
    var tempKeys = Object.keys(params);
    tempKeys.sort();
    tempKeys.forEach(function (key) {
        var n = params[key].includes("REFUND");
        var m = params[key].includes("|");
        if (n === true) {
            params[key] = "";
        }
        if (m === true) {
            params[key] = "";
        }
        if (key !== 'CHECKSUMHASH') {
            if (params[key] === 'null')
                params[key] = '';
            if (!mandatoryflag) {
                data += (params[key] + '|');
            }
        }
    });
    return data;
}
function genchecksum(params, key, cb) {
    var data = paramsToString(params);
    crypt_1.default.gen_salt(4, function (err, salt) {
        if (err) {
            console.log(err);
        }
        var sha256 = crypto_1.default.createHash('sha256').update(data + salt).digest('hex');
        var check_sum = sha256 + salt;
        var encrypted = crypt_1.default.encrypt(check_sum, key);
        params.CHECKSUMHASH = encrypted;
        cb(undefined, params);
    });
}
exports.genchecksum = genchecksum;
function genchecksumbystring(params, key, cb) {
    crypt_1.default.gen_salt(4, function (err, salt) {
        if (err) {
            console.log(err);
        }
        var sha256 = crypto_1.default.createHash('sha256').update(params + '|' + salt).digest('hex');
        var check_sum = sha256 + salt;
        var encrypted = crypt_1.default.encrypt(check_sum, key);
        var CHECKSUMHASH = encodeURIComponent(encrypted);
        CHECKSUMHASH = encrypted;
        cb(undefined, CHECKSUMHASH);
    });
}
exports.genchecksumbystring = genchecksumbystring;
function verifychecksum(params, key) {
    var data = paramsToString(params, false);
    if (params.CHECKSUMHASH) {
        params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
        params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');
        var temp = decodeURIComponent(params.CHECKSUMHASH);
        var checksum = crypt_1.default.decrypt(temp, key);
        var salt = checksum.substr(checksum.length - 4);
        var sha256 = checksum.substr(0, checksum.length - 4);
        var hash = crypto_1.default.createHash('sha256').update(data + salt).digest('hex');
        if (hash === sha256) {
            return true;
        }
        else {
            util_1.default.log("checksum is wrong");
            return false;
        }
    }
    else {
        util_1.default.log("checksum not found");
        return false;
    }
}
exports.verifychecksum = verifychecksum;
function verifychecksumbystring(params, key, checksumhash) {
    var checksum = crypt_1.default.decrypt(checksumhash, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = crypto_1.default.createHash('sha256').update(params + '|' + salt).digest('hex');
    if (hash === sha256) {
        return true;
    }
    else {
        util_1.default.log("checksum is wrong");
        return false;
    }
}
exports.verifychecksumbystring = verifychecksumbystring;
function genchecksumforrefund(params, key, cb) {
    var data = paramsToStringrefund(params);
    crypt_1.default.gen_salt(4, function (err, salt) {
        if (err) {
            console.log(err);
        }
        var sha256 = crypto_1.default.createHash('sha256').update(data + salt).digest('hex');
        var check_sum = sha256 + salt;
        var encrypted = crypt_1.default.encrypt(check_sum, key);
        params.CHECKSUM = encodeURIComponent(encrypted);
        cb(undefined, params);
    });
}
exports.genchecksumforrefund = genchecksumforrefund;
function paramsToStringrefund(params, mandatoryflag) {
    var data = '';
    var tempKeys = Object.keys(params);
    tempKeys.sort();
    tempKeys.forEach(function (key) {
        var m = params[key].includes("|");
        if (m === true) {
            params[key] = "";
        }
        if (key !== 'CHECKSUMHASH') {
            if (params[key] === 'null')
                params[key] = '';
            if (!mandatoryflag) {
                data += (params[key] + '|');
            }
        }
    });
    return data;
}
//# sourceMappingURL=checksum.js.map