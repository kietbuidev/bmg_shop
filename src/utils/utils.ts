import * as phpSerialize from 'php-serialize';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import axios from 'axios';

function isSerialized(data: string, strict: boolean = true): boolean {
  // If it isn't a string, it isn't serialized.
  if (typeof data !== 'string') {
    return false;
  }

  data = data.trim();

  if ('N;' === data) {
    return true;
  }

  if (data.length < 4) {
    return false;
  }

  if (':' !== data[1]) {
    return false;
  }

  if (strict) {
    const lastChar = data.slice(-1);
    if (';' !== lastChar && '}' !== lastChar) {
      return false;
    }
  } else {
    const semicolon = data.indexOf(';');
    const brace = data.indexOf('}');
    // Either ; or } must exist.
    if (semicolon === -1 && brace === -1) {
      return false;
    }
    // But neither must be in the first X characters.
    if (semicolon !== -1 && semicolon < 3) {
      return false;
    }
    if (brace !== -1 && brace < 4) {
      return false;
    }
  }

  const token = data[0];

  switch (token) {
    case 's':
      if (strict) {
        if ('"' !== data.slice(-2, -1)) {
          return false;
        }
      } else if (data.indexOf('"') === -1) {
        return false;
      }
    // Or else fall through.
    case 'a':
    case 'O':
      return /^(s|a|O):[0-9]+:/.test(data);
    case 'b':
    case 'i':
    case 'd':
      const end = strict ? '$' : '';
      return new RegExp(`^(${token}:[0-9.E+-]+;${end})`).test(data);
  }

  return false;
}

export const maybeUnserialize = (original: string): any => {
  if (isSerialized(original)) {
    try {
      return phpSerialize.unserialize(original);
    } catch (error) {
      return original;
    }
  }

  if (original === '[]') {
    return [];
  }

  return original;
};

export const generateCode = (length: number): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 9);
  }

  return code;
};

export interface IsStrongPasswordOptions {
  minLength: number;
  requireLowerCase: boolean;
  requireUpperCase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
}

export function IsStrongPassword(password: string, options?: IsStrongPasswordOptions): boolean {
  const {minLength = 8, requireLowerCase = true, requireUpperCase = true, requireNumbers = true, requireSymbols = false} = options || {};

  if (password.length < minLength) {
    return false;
  }

  if (requireLowerCase && !/[a-z]/.test(password)) {
    return false;
  }

  if (requireUpperCase && !/[A-Z]/.test(password)) {
    return false;
  }

  if (requireNumbers && !/\d/.test(password)) {
    return false;
  }

  if (requireSymbols && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
    return false;
  }

  return true;
}

export function generateExpiredCode(): Date {
  const time = 30 * 60; // Set expired
  const expired = new Date();
  expired.setSeconds(expired.getSeconds() + time);
  return expired;
}

export function readFileAsync(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export const readFile = (filePath: string) => {
  //return fs.readFileSync(`./dist/utils/templates/email/${filePath}`, 'utf8');
  return fs.readFileSync(path.join(__dirname, `templates/email/${filePath}`), 'utf8');
};

export const timeConvert = (n) => {
  const num = n;
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return rhours + 'h ' + rminutes + 'm';
};

export const formatTime = (time, option: string, locale?: string) => {
  if (locale) {
    return moment(time).locale(locale).format(option);
  }
  return moment(time).format(option);
};

export const checkLanguages = (lang: string) => {
  const languages = [
    'vi',
    'en',
    'de',
    'es',
    'zh',
    'hi',
    'fr',
    'pt',
    'id',
    'ja',
    'ru',
    'ko',
    'it',
    'th',
    'ms',
    'my',
    'tl',
    'bn',
    'sw',
    'tr',
    'ta',
    'uk',
    'fi',
    'sl',
    'pl',
    'ro',
    'be',
    'az',
    'tt',
    'el',
    'bg',
    'hu',
    'sr',
    'cs',
    'kk',
    'lt',
    'lv',
    'hr',
    'bs',
    'sk',
    'et',
    'nl',
    'sq',
    'ca',
    'sv',
    'co',
    'da',
    'gl',
    'mk',
    'ka',
    'hy',
    'am',
    'jv',
    'mn',
    'mg',
    'ku',
    'so',
    'sn',
    'rw',
    'af',
  ];
  if (languages.includes(lang)) {
    return lang;
  }
  return 'en';
};

export function convertTo24Hour(time) {
  if (moment(time, 'HH:mm:ss', true).isValid()) {
    return moment(time, 'HH:mm:ss').format('HH:mm');
  } else if (moment(time, 'hA', true).isValid()) {
    return moment(time, 'hA').format('HH:mm');
  }
  return null;
}

export function getIpAddress(clientIp) {
  if (clientIp.includes('::ffff:')) {
    clientIp = clientIp.split('::ffff:')[1];
  }

  const method: string = 'GET';
  const apiKey = '03f97d96f6ee42cca786198a65ed90fc';
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${clientIp}`;

  const configAxios = {
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(configAxios)
    .then((response) => {
      if (response.data && response.data.country_code2) {
        return response.data.country_code2;
      }
    })
    .catch((err) => {
      return null;
    });
}

export const convertHtmlToString = (airline_code: string): string => {
  try {
    return fs.readFileSync(`./dist/utils/fareRule/HPL/${airline_code}.hbs`, 'utf8');
    // return fs.readFileSync(path.join(__dirname, `fareRule/HPL/${airline_code}.hbs`), 'utf8');
  } catch (error) {
    return null;
  }
};

export const formatAddressHotel = (address: string): string => {
  return address
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(?<=\w)\. +(?=\w)/g, '.')
    .replace(/,\s*,/g, ',')
    .replace(/\. *,/g, ',')
    .replace(/(?<!\d)\s*([,\.])\s*(?!\d)/g, '$1 ')
    .replace(/[,\.]{2,}/g, (match) => match[0])
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const generateCodeBase32 = (length: number = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
