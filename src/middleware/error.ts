import {NextFunction, Request, Response} from 'express';
import {CustomError} from 'utils/customError';
import {logger} from '../utils/logger';
import {IConfig} from '../utils/types';
import {ConfigDefault} from '../utils/enums';
import i18n from '../lang/i18n';

const errorMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  try {
    const config = req.headers as unknown as IConfig;
    const language: string = config?.language || ConfigDefault.language;
    i18n.locale = language;
    const status: number = error.statusCode || 500;
    const option: any = error.option;
    const error_code: string = error.errorCode;
    const message: string = error.errorCode ? i18n.t(error.errorCode, {defaultValue: error.errorCode, locale: language}) : error.message || 'Something went wrong!';
    // const errors: string[] = [message];
    logger.error(`[${req?.method}] ${req?.path} >> StatusCode:: ${status}, Message:: ${message}`);

    res.status(status).json({status, error_code, message, option});
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
