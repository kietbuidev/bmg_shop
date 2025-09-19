import jwt from 'jsonwebtoken';
import configJwt from '../config/jwt';
import {RedisClient} from '../config/redis';
import createHttpError from 'http-errors';
import {NotFoundError} from '../utils/customError';
import {payloadToken} from '../database/models/dtos/jwtDto';

const signAccessToken = (payloadToken: payloadToken) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: payloadToken.user_id,
      full_name: payloadToken.full_name,
      avatar: payloadToken.avatar,
      tier: payloadToken.tier,
      alias: payloadToken.alias,
      email: payloadToken.email,
    };
    const secret = configJwt.secret;
    const options = {
      expiresIn: configJwt.jwtExpiration,
    };
    jwt.sign(payload, secret, options, (err: any, token: any) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const signRefreshToken = async (userId: string) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      userId,
    };
    const secret = configJwt.secret;
    const options = {
      expiresIn: configJwt.jwtRefreshExpiration,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const authJwt = {
  signAccessToken,
  signRefreshToken,
};
export = authJwt;
