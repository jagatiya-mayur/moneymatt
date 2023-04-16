"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
var crypt = {
    iv: '@@@@&&&&####$$$$',
    encrypt: function (data, custom_key) {
        var iv = this.iv;
        var key = custom_key;
        var algo = '256';
        switch (key.length) {
            case 16:
                algo = '128';
                break;
            case 24:
                algo = '192';
                break;
            case 32:
                algo = '256';
                break;
        }
        var cipher = crypto_1.default.createCipheriv('AES-' + algo + '-CBC', key, iv);
        var encrypted = cipher.update(data, 'binary', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    },
    decrypt: function (data, custom_key) {
        var iv = this.iv;
        var key = custom_key;
        var algo = '256';
        switch (key.length) {
            case 16:
                algo = '128';
                break;
            case 24:
                algo = '192';
                break;
            case 32:
                algo = '256';
                break;
        }
        var decipher = crypto_1.default.createDecipheriv('AES-' + algo + '-CBC', key, iv);
        var decrypted = decipher.update(data, 'base64', 'binary');
        try {
            decrypted += decipher.final('binary');
        }
        catch (e) {
            util_1.default.log(util_1.default.inspect(e));
        }
        return decrypted;
    },
    gen_salt: function (length, cb) {
        crypto_1.default.randomBytes((length * 3.0) / 4.0, function (err, buf) {
            var salt;
            if (!err) {
                salt = buf.toString("base64");
            }
            cb(err, salt);
        });
    },
    md5sum: function (salt, data) {
        return crypto_1.default.createHash('md5').update(salt + data).digest('hex');
    },
    sha256sum: function (salt, data) {
        return crypto_1.default.createHash('sha256').update(data + salt).digest('hex');
    }
};
exports.default = crypt;
(function () {
    var i;
    function logsalt(err, salt) {
        if (!err) {
            console.log('salt is ' + salt);
        }
    }
    if (require.main === module) {
        var enc = crypt.encrypt('One97');
        console.log('encrypted - ' + enc);
        console.log('decrypted - ' + crypt.decrypt(enc));
        for (i = 0; i < 5; i++) {
            crypt.gen_salt(4, logsalt);
        }
    }
}());
//# sourceMappingURL=crypt.js.map