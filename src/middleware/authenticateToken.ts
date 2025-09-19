import jwt from 'jsonwebtoken';
import configJwt from '../config/jwt';
import type {Response, NextFunction} from 'express';
import {IConfig, RequestCustom} from '../utils/types';
import User from '../database/models/user';
import {ConfigDefault, EnvType} from '../utils/enums';
import i18n from '../lang/i18n';
const HEYO_KEY = process.env.HEYO_KEY || '';
const APP_ENV = (process.env.APP_ENV || process.env.NODE_ENV || EnvType.DEVELOPMENT).toUpperCase();

export const authenticateUserToken = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const config = req.headers as unknown as IConfig;
  const authHeader: string = req.headers['authorization'];
  const token: string = authHeader && authHeader.split(' ')[1];
  const secrect = configJwt.secret;
  const language: string = config?.language || ConfigDefault.language;
  i18n.locale = language;
  if (token) {
    jwt.verify(token, secrect, (err, user: User) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          error_code: 'PLEASE_LOGIN_AGAIN',
          message: i18n.t('PLEASE_LOGIN_AGAIN'),
          option: null,
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      status: 401,
      error_code: 'PLEASE_LOGIN_TO_SEE_MORE_INFORMATION',
      message: i18n.t('PLEASE_LOGIN_TO_SEE_MORE_INFORMATION'),
      option: null,
    });
  }
};

export const isUserToken = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers['authorization'];
  const token: string = authHeader && authHeader.split(' ')[1];
  const secrect = configJwt.secret;
  const authenToken: string = req.query['x-api-key'] as string | null;
  if (authenToken) {
    req.headers['x_api_key'] = authenToken;
  }

  if (token) {
    jwt.verify(token, secrect, (err, user: User) => {
      if (user) {
        req.headers['user_id'] = user?.['userId'] as any;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
};

export const checkAuthenticateToken = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const config = req.headers as unknown as IConfig;
  const language: string = config?.language || ConfigDefault.language;
  i18n.locale = language;
  const authenToken: string = req.headers['x-api-key'] as string | null;
  if (authenToken && Buffer.from(authenToken.toString(), 'base64').toString() === HEYO_KEY) {
    req.headers['x_api_key'] = authenToken;
    next();
  } else {
    return res.status(401).json({
      status: 401,
      error_code: 'ERROR_AUTHENTICATION',
      message: i18n.t('ERROR_AUTHENTICATION'),
      option: null,
    });
  }
};

export const checkEnvironment = async (req: RequestCustom, res: Response, next: NextFunction) => {
  if (APP_ENV === EnvType.PRODUCTION) {
    next();
  } else {
    return res.status(401).json({
      status: 401,
      error_code: 'ERROR_AUTHENTICATION',
      message: i18n.t('ERROR_AUTHENTICATION'),
      option: null,
    });
  }
};
