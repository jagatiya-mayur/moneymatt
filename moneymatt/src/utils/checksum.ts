import crypt from './crypt';
import util from 'util';
import crypto from 'crypto';

//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params: any, mandatoryflag?: any) {
  var data: any = '';
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
      if (params[key] === 'null') params[key] = '';
      if (!mandatoryflag) {
        data += (params[key] + '|');
      }
    }
  });
  return data;
}


export function genchecksum(params: any, key: any, cb: Function) {
  var data = paramsToString(params);
  crypt.gen_salt(4, function (err: Error, salt: any) {

    if (err) {
      console.log(err);
    }

    var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);
    params.CHECKSUMHASH = encrypted;
    cb(undefined, params);
  });
}
export function genchecksumbystring(params: any, key: any, cb: Function) {

  crypt.gen_salt(4, function (err: Error, salt: any) {

    if (err) {
      console.log(err);
    }

    var sha256 = crypto.createHash('sha256').update(params + '|' + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);

    var CHECKSUMHASH = encodeURIComponent(encrypted);
    CHECKSUMHASH = encrypted;
    cb(undefined, CHECKSUMHASH);
  });
}

export function verifychecksum(params: any, key: any) {
  var data = paramsToString(params, false);
  //TODO: after PG fix on thier side remove below two lines
  if (params.CHECKSUMHASH) {
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');

    var temp = decodeURIComponent(params.CHECKSUMHASH);
    var checksum = crypt.decrypt(temp, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
    if (hash === sha256) {
      return true;
    } else {
      util.log("checksum is wrong");
      return false;
    }
  } else {
    util.log("checksum not found");
    return false;
  }
}

export function verifychecksumbystring(params: any, key: any, checksumhash: any) {

  var checksum = crypt.decrypt(checksumhash, key);
  var salt = checksum.substr(checksum.length - 4);
  var sha256 = checksum.substr(0, checksum.length - 4);
  var hash = crypto.createHash('sha256').update(params + '|' + salt).digest('hex');
  if (hash === sha256) {
    return true;
  } else {
    util.log("checksum is wrong");
    return false;
  }
}

export function genchecksumforrefund(params: any, key: any, cb: Function) {
  var data = paramsToStringrefund(params);
  crypt.gen_salt(4, function (err: Error, salt: any) {
    if (err) {
      console.log(err);
    }
    var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);
    params.CHECKSUM = encodeURIComponent(encrypted);
    cb(undefined, params);
  });
}

function paramsToStringrefund(params: any, mandatoryflag?: any) {
  var data = '';
  var tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach(function (key) {
    var m = params[key].includes("|");
    if (m === true) {
      params[key] = "";
    }
    if (key !== 'CHECKSUMHASH') {
      if (params[key] === 'null') params[key] = '';
      if (!mandatoryflag) {
        data += (params[key] + '|');
      }
    }
  });
  return data;
}

