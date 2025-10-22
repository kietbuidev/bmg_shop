import jwt from 'jsonwebtoken';
import configJwt from '../config/jwt';

const signAccessToken = (payloadToken: any) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: payloadToken.user_id,
      full_name: payloadToken.full_name,
      avatar: payloadToken.avatar,
      email: payloadToken.email,
      roles: payloadToken.roles,
      is_admin: payloadToken.is_admin,
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
