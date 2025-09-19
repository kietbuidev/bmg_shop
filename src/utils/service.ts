import {random} from 'lodash';
import crypto from 'crypto';
import moment from 'moment-timezone';
import {ServiceType, ProviderCode, ExpiredBookingHotelClient, ExpiredBookingFlightClient, ExpiredBookingHotelAdmin, ExpiredBookingFlightAdmin, HTTPCode} from './enums';
import bcrypt from 'bcrypt';
import Constants from '../config/constantConfig';
import axios from 'axios';
import urlConfig from '../config/urlConfig';
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import authConfig from '../config/authConfig';
import {CustomError} from './customError';
import CoinRewards from '../database/models/coin_rewards';

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWj&U*(%$H^dxs0(Llq#$G^';

export const checkImageNotfound = (image: string) => {
  if (typeof image !== 'string' || !image.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    return `${urlConfig.S3_URL}static/general/no_image.png`;
  } else return image;
};

export const createOrderCode = async function (type = ServiceType.HOTEL, vendor: string = ProviderCode.TRAVELPORT) {
  let orderType = 2;
  if (type === ServiceType.HOTEL) orderType = 1;
  let orderCode = '';
  let currentDate = moment().format('DDMMYYYY'); // 'DDMMYYYYHHmmss'

  let randomCode = random(123456, 456789);

  orderCode = `${currentDate}-HY-F-${vendor}-${randomCode}`;
  if (type === ServiceType.HOTEL) {
    orderCode = `${currentDate}-HY-H-${vendor}-${randomCode}`;
  }
  return orderCode;
};

export const getCardTypeByNumber = function (cardNumber: string) {
  if (/^4\d{6,}$/.test(cardNumber)) {
    return 'VI';
  }
  if (/^(5[1-5]\d{5,}|222[1-9]\d{3,}|22[3-9]\d{4,}|2[3-6]\d{5,}|27[01]\d{4,}|2720\d{3,})$/.test(cardNumber)) {
    return 'CA';
  }
  if (/^3[47]\d{5,}$/.test(cardNumber)) {
    return 'AX';
  }
  if (/^3(?:0[0-5]|[68]\d)\d{4,}$/.test(cardNumber)) {
    return 'DS';
  }
  if (/^6(?:011|5\d{2})\d{3,}$/.test(cardNumber)) {
    return 'DC';
  }
  if (/^(?:2131|1800|35\d{3})\d{3,}$/.test(cardNumber)) {
    return 'JC';
  }
  return 'VI';
};

export function randomStringNumber(count: number): string {
  let text = '';
  let possible = '0123456789';

  for (let i = 0; i < count; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function checkParamsValidate(params: any[]): boolean {
  let isParamIsValidate = false;

  params.forEach((item, index) => {
    if (item || typeof item === 'number') {
      if (typeof item === 'string') {
        if (item.trim().length === 0) {
          isParamIsValidate = true;
        }
      }
    } else {
      isParamIsValidate = true;
    }
  });

  return isParamIsValidate;
}

export function formatCoin(coinName: string = '', version: string = '') {
  if (!coinName || !version) return '';
  coinName = coinName.toUpperCase();
  switch (version) {
    case 'tron':
      if (coinName !== 'TRX') coinName = `${coinName} (TRC20)`;
      break;
    case 'bnb':
      if (coinName !== 'BNB') coinName = `${coinName} (BEP20)`;
      break;
    case 'v2':
      if (coinName !== 'ETH') coinName = `${coinName} (BEP20)`;
      break;
    default:
      break;
  }
  return coinName;
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

export function decrypt(hash: Object) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash['iv'], 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash['content'], 'hex')), decipher.final()]);

  return decrpyted.toString();
}

// export function expireBooking(dateTime: Date) {
//   const createdAt = moment(dateTime).add(14, 'minutes').add(50, 'seconds');
//   if(createdAt <= moment()) return false;
//   return true;
// }

export const hash = (data: string): string => bcrypt.hashSync(data, bcrypt.genSaltSync());
export const compare = (data: string, hash: string): boolean => bcrypt.compareSync(data, hash);

export function formatDateTime(date = new Date(), tmz = 420) {
  date = moment(date).add(-420, 'm').toDate();
  date = moment(date).add(tmz, 'm').toDate();
  return moment(date).format();
}

export function timeToNumber(str) {
  let arrs = str.split(':');
  return Number(arrs[0]) * 60 + Number(arrs[1]);
}

export function expiredBookingHotelAdmin(timestamp: any, providerCode = '') {
  let duration = 0;
  let dateNow = moment(new Date());
  let expiredBooking = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  let expiredBookingSeconds: any = moment.duration(dateNow.diff(expiredBooking)).asSeconds();
  if (parseInt(expiredBookingSeconds) > 0) {
    // let expireBookingHotel = providerCode === ProviderCode.TRAVELPORT ? Constants.EXPIRED_BOOKING_HOTEL.TVP : Constants.EXPIRED_BOOKING_HOTEL.AMADEUS;
    let expireBookingHotel = providerCode === ProviderCode.TRAVELPORT ? ExpiredBookingHotelAdmin.TVP : ExpiredBookingHotelAdmin.AMADEUS;
    duration = expireBookingHotel - expiredBookingSeconds;
  }
  return duration;
}

export function expiredBookingHotelClient(timestamp: any) {
  let duration = 0;
  let dateNow = moment(new Date());
  let expiredBooking = moment(timestamp);
  let expiredBookingSeconds: any = moment.duration(dateNow.diff(expiredBooking)).asSeconds();
  if (expiredBookingSeconds) {
    let expireBookingHotel = ExpiredBookingHotelClient.Client;
    duration = Number(expireBookingHotel) - expiredBookingSeconds;
  }

  return duration;
}

export function expiredBookingFlightAdmin(startDate: any, orderCreatedAt: any) {
  let payementExTime = ExpiredBookingFlightAdmin.OVER24H;

  const departureStartDate = moment(startDate);
  const currentDate = moment(new Date());
  const hoursDiff = moment.duration(departureStartDate.diff(currentDate)).asHours();
  if (hoursDiff < 8) {
    payementExTime = ExpiredBookingFlightAdmin.SMALL24H;
  }
  const statusTimeout = moment(orderCreatedAt).add(payementExTime, 'hours');
  const now = moment();
  const remainingTime: any = moment.duration(statusTimeout.diff(now));
  const remainingTimeInSeconds = parseInt(remainingTime.asSeconds());

  return remainingTimeInSeconds;
}

export function expiredBookingFlightClient(orderCreatedAt: any) {
  //startDate: any,
  let payementExTime = ExpiredBookingFlightClient.Client;

  const statusTimeout = moment(orderCreatedAt).add(payementExTime, 'hours');
  const now = moment();
  const remainingTime: any = moment.duration(statusTimeout.diff(now));
  const remainingTimeInSeconds = parseInt(remainingTime.asSeconds());

  return remainingTimeInSeconds;
}

export function nonAccentVietnamese(str: any) {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export function formatHotelTime(time = '00:00') {
  if (time == null || time == 'null' || time == undefined) return '';
  return moment(time, 'hA').format('hA');
}

export function timeZoneVN(time) {
  // if (!time.includes('+07:00')) {
  //   time = time + '+07:00';
  // }

  return time;
}

export function formatTime(time = '') {
  let timeKey = 0;
  if (time) {
    let flightTime = Constants.FLIGHT_TIME_FILTER,
      formatTime = 'HH:mm';
    for (const key in flightTime) {
      if (Object.hasOwnProperty.call(flightTime, key)) {
        let eleTime = flightTime[key];
        eleTime = eleTime.split(' - ');
        eleTime[0] = moment(eleTime[0], formatTime).format(formatTime);
        eleTime[1] = moment(eleTime[1], formatTime).format(formatTime);
        if (time >= eleTime[0] && time <= eleTime[1]) {
          timeKey = parseInt(key);
          break;
        }
      }
    }
  }

  return Number(timeKey);
}

export function timeConvert(n) {
  const num = n;
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return rhours + 'h ' + rminutes + 'm';
}

export function delay(timer = 200) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(0);
    }, timer);
  });
}

export function ConvertMileToKilomet(mile = 0) {
  return mile * 1.609344; // 1mile = 1,609344 kilomet
}

export function haversineDistance(latFrom, longFrom, latTo, longTo) {
  let distance = 0;
  if (latFrom && longFrom && latTo && longTo) {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const lat1Rad = toRadians(latFrom);
    const lon1Rad = toRadians(longFrom);
    const lat2Rad = toRadians(latTo);
    const lon2Rad = toRadians(longTo);

    const latDelta = lat2Rad - lat1Rad;
    const lonDelta = lon2Rad - lon1Rad;

    const a = Math.sin(latDelta / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDelta / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const earthRadius = 6371;
    distance = earthRadius * c;
  }

  return distance;
}

export function paginateArray<T>(collection: T[], page: number = 1, numItems = 10) {
  if (!Array.isArray(collection)) {
    throw `Expect array and got ${typeof collection}`;
  }

  const current_page = Number(page);
  const per_page = numItems;
  const offset = (page - 1) * per_page;
  const paginatedItems = collection.slice(offset, offset + per_page);

  return {
    rows: paginatedItems as T[],
    pagination: {
      current_page: current_page,
      per_page: per_page,
      count: collection.length,
      total_page: Math.ceil(collection.length / per_page),
    },
  };
}

export function modifiedEmailContactTVP(email: string) {
  const modifiedEmail = email.replace(/@/g, '//').replace(/_/g, '..').replace(/-/g, './');
  return modifiedEmail;
}

export function findKeysByValue(obj, value) {
  return Object.keys(obj).filter((key) => obj[key] === value);
}

export function formatTimeZoneUTC(timeZoneOffset: string) {
  const momentObj = moment.parseZone(timeZoneOffset);
  const offset = momentObj.format('Z');
  const offsetHours = offset.slice(0, 3);
  const hours = Number(offsetHours.slice(1, 3));

  return moment(timeZoneOffset)
    .utc()
    .add(offsetHours.slice(0, 1) + hours, 'hours')
    .format('YYYY-MM-DD HH:mm:ss');
}

export function extractBaggageInfoBackup(data: string) {
  //   const baggagePattern = /\b\d+\s*(kg|kgs)\b/i;

  //   const baggageInfo = {
  //     free_baggage: '',
  //     hand_baggage: ''
  //   };

  //   const lines = data.split(/[\r\n]+/);
  //   lines.forEach(line => {
  //     if (baggagePattern.test(line)) {
  //       const cleanLine = line.replace(/^- /, '').trim();

  //       if (/checked/i.test(cleanLine)) {
  //         baggageInfo.free_baggage = cleanLine;
  //       } else {
  //         baggageInfo.hand_baggage = cleanLine;
  //       }
  //     }
  //   });

  //   return baggageInfo;
  const baggagePattern = /\b\d+\s*(kg|kgs)\b/i;

  const baggageInfo = {
    free_baggage: '',
    hand_baggage: '',
  };

  const lines = data.split(/[\r\n]+/);
  lines.forEach((line) => {
    if (baggagePattern.test(line)) {
      const sanitizedLine = line.split(/\band\b/i)[0].trim();

      const pcKgPattern = /(\d+pc)?\s*(\d+\s*(kg|kgs))/i;
      const match = sanitizedLine.match(pcKgPattern);

      if (match) {
        const pcs = match[1] ? match[1].trim() : '';
        const kgs = match[2].replace(/kgs/i, 'kg').trim();

        const cleanLine = pcs && kgs ? `${pcs} x ${kgs}` : `${pcs}${kgs}`.trim();

        if (/checked/i.test(sanitizedLine)) {
          baggageInfo.free_baggage = cleanLine;
        } else {
          baggageInfo.hand_baggage = cleanLine;
        }
      }
    }
  });

  return baggageInfo;
}

export function extractBaggageInfo(data: string) {
  // Check for empty or undefined input to return default empty object
  let baggageInfo = {
    hand_baggage: '',
    free_baggage: '',
  };

  if (!data || data.trim() === '') {
    return baggageInfo;
  }

  // Regex to match lines containing weight in kg or kgs
  // Regex to match lines containing weight in kg or kgs
  const baggagePattern = /\b\d+\s*(kg|kgs)\b/i;

  // Split input into lines and trim whitespace
  const lines = data.split(/[\r\n]+/).map((line) => line.trim());

  // Process each line
  lines.forEach((line) => {
    // Check if the line contains weight information
    if (baggagePattern.test(line)) {
      // Remove any text after "and" to clean the line
      const sanitizedLine = line.split(/\band\b/i)[0].trim();

      // Regex to extract pieces (e.g., "01 pc") and weight (e.g., "23kg")
      const pcKgPattern = /(\d+pc)?\s*(\d+\s*(kg|kgs))/i;
      const match = sanitizedLine.match(pcKgPattern);

      if (match) {
        // Extract pieces (if any) and weight, standardize "kgs" to "kg"
        const pcs = match[1] ? match[1].trim() : '';
        const kgs = match[2].replace(/kgs/i, 'kg').trim();

        // Format output as "<pieces> x <weight>" or just "<weight>"
        const cleanLine = pcs ? `${pcs} x ${kgs}` : kgs;

        // Assign to free_baggage if line contains "free", "allowance", "check", or "check-in"
        if (/free|allowance|check(?:-in)?\b/i.test(sanitizedLine)) {
          baggageInfo.free_baggage = cleanLine;
        }
        // Assign to hand_baggage if line contains "cabin" or "hand"
        else if (/cabin|hand\b/i.test(sanitizedLine)) {
          baggageInfo.hand_baggage = cleanLine;
        }
      }
    }
  });

  // Return the extracted baggage information
  return baggageInfo;
}

export function getCurrentAndNextMonth(flightDate: string) {
  let year = Number(moment(flightDate).format('YYYY'));
  let month = Number(moment(flightDate).format('MM'));
  let day = Number(moment(flightDate).format('DD'));
  const referenceDate = moment({year, month: month - 1, day});

  const totalDaysInMonth = referenceDate.daysInMonth();

  const daysLeft = totalDaysInMonth - referenceDate.date();

  if (daysLeft <= 10) {
    const nextMonth = referenceDate.clone().add(1, 'month').startOf('month');
    return {
      currentMonth: referenceDate.format('YYYY-MM'),
      nextMonth: nextMonth.format('YYYY-MM'),
    };
  } else {
    return {
      currentMonth: referenceDate.format('YYYY-MM'),
      nextMonth: '',
    };
  }
}

// export async function checkThumbnail(image: string): Promise<string | null> {
//   if (!/^https?:\/\//.test(image)) {
//     return null;
//   }

//   if (!/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/i.test(image)) {
//     return null;
//   }

//   try {
//     const response = await axios.head(image, { timeout: 5000 });
//     if (response.status === 200 && response.headers['content-type']?.startsWith('image')) {
//       return image;
//     }

//     return null;
//   } catch {
//     return null;
//   }
// }

export function checkThumbnail(image: string) {
  if (!/^https?:\/\//.test(image)) {
    return null;
  }

  if (!/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/i.test(image)) {
    return null;
  }

  return image;
}

export async function checkThumbnailWithAxios(image: string): Promise<string | null> {
  try {
    await axios.head(image, {
      timeout: 3000,
      maxRedirects: 3,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    return image;
  } catch {
    return null;
  }
}

export function expiredTimeBooking(orderExpiredTime: any) {
  const current_time = moment();
  const expired_time = moment(orderExpiredTime);
  const diffSeconds = current_time.diff(expired_time, 'seconds');
  const diffMinutes = Math.floor(diffSeconds / 60);

  let result = 0;
  if (diffMinutes < 15) {
    result = 900 - Number(diffSeconds);
    // } else if (diffMinutes > 15 && diffMinutes < 60) {
    //   const nextThreshold = Math.ceil(diffMinutes / 15) * 15;
    //   const remainingMinutes = nextThreshold - diffMinutes;
    //   const remainingSeconds = remainingMinutes * 60 - (diffSeconds % 60);
    //   result = remainingSeconds;
  }

  return result;
}

export function checkTimeBooking(orderExpiredTime: any, orderStartDate: any): number {
  const expiredTime = moment(orderExpiredTime);
  const startDate = moment(orderStartDate);
  const hoursDiff = startDate.diff(expiredTime, 'hours', true);

  return hoursDiff;
}

export function crc16CCITTFalse(buffer: Buffer) {
  let crc = 0xffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc;
}

export function formatFieldQrCode(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`;
}

export function decodeBase64Image(base64String: string) {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new CustomError(HTTPCode.REQUIRED, 'Invalid base64 format');
  }

  return {
    contentType: matches[1],
    buffer: Buffer.from(matches[2], 'base64'),
    extension: matches[1].split('/')[1],
  };
}

export async function updateImageS3(imageBase64: string, folderName: string): Promise<{filename: string; path: string; type: string; size: number}> {
  try {
    // Cấu hình AWS S3
    const s3 = new S3Client({
      region: authConfig.s3.region,
      credentials: {
        accessKeyId: authConfig.s3.accessKeyId,
        secretAccessKey: authConfig.s3.secretAccessKey,
      },
    });

    const {buffer, contentType, extension} = decodeBase64Image(imageBase64);
    const fileName = `${Date.now()}.${extension}`;
    const key = `images/upload/${folderName}/${authConfig.s3.folder}${fileName}`;
    const bucket = 'heyotrip-img';

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ContentEncoding: 'base64',
      ACL: 'public-read',
    });

    await s3.send(command);
    const location = `https://${bucket}.s3.ap-southeast-1.amazonaws.com/${key}`;

    return {
      filename: fileName,
      path: location,
      type: extension,
      size: buffer.length,
    };
  } catch (error) {
    if (error.errorCode) {
      throw new CustomError(error.statusCode, error.errorCode);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function deleteImageS3(imageUrl: string): Promise<void> {
  try {
    // Cấu hình AWS S3
    const s3 = new S3Client({
      region: authConfig.s3.region,
      credentials: {
        accessKeyId: authConfig.s3.accessKeyId,
        secretAccessKey: authConfig.s3.secretAccessKey,
      },
    });
    if (!imageUrl) {
      return null;
    }

    const key = imageUrl.split('amazonaws.com/')[1];
    if (!key) {
      return null;
    }
    const command = new DeleteObjectCommand({
      Bucket: 'heyotrip-img',
      Key: key,
    });

    await s3.send(command);
  } catch (error) {
    if (error.errorCode) {
      throw new CustomError(error.statusCode, error.errorCode);
    } else {
      throw new Error(error.message);
    }
  }
}

export function getCurrentAndNextTier(tiers, count: number) {
  if (!tiers || tiers.length === 0) return {current: null, next: null};

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const nextTier = tiers[i + 1];

    if (count < tiers[0].booking_number) {
      return {current: tiers[0].id, next: tiers[0].id};
    }

    if (count >= tier.booking_number && (!nextTier || count < nextTier.booking_number)) {
      return {
        current: tier.id,
        next: nextTier ? nextTier.id : tier.id,
      };
    }
  }

  const lastTier = tiers[tiers.length - 1];
  return {current: lastTier.id, next: lastTier.id};
}

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
}

export function getCoinByPrice(price: number, rules: CoinRewards[]): number {
  let left = 0;
  let right = rules.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const rule = rules[mid];

    const max = rule.max_price ?? Infinity;
    if (price >= rule.min_price && price <= max) {
      return rule.coin_earned;
    }

    if (price < rule.min_price) {
      right = mid - 1;
    } else {
      left = mid + 1;
    } 
  }

  return 0;
}
