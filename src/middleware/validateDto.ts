import {Request, Response, NextFunction} from 'express';
import {validate, ValidationError} from 'class-validator';
import {plainToClass} from 'class-transformer';
import {logger} from '../utils/logger';
import {IConfig} from '../utils/types';
import {ConfigDefault, HTTPCode} from '../utils/enums';

export const validateDto =
  <T extends object>(dtoClass: new () => T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const config = req.headers as unknown as IConfig;
    // i18n.locale = config.language || ConfigDefault.language;
    const dtoInstance = plainToClass(dtoClass, req.method === 'GET' ? req.query : req.body);

    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const extractErrors = (validationErrors: ValidationError[]): string[] => {
        return validationErrors.flatMap((error) => {
          if (error.children && error.children.length > 0) {
            return extractErrors(error.children);
          }
          return Object.values(error.constraints || {});
        });
      };

      const formattedErrors = extractErrors(errors);

      logger.warn(`Validation failed for ${req.method} ${req.originalUrl}: ${formattedErrors.join(', ')}`);

      return res.status(HTTPCode.BAD_REQUEST).json({
        status: HTTPCode.BAD_REQUEST,
        error_codes: formattedErrors.join(', '),
        message: "",
        // errors: formattedErrors,
        option: null,
      });
    }

    if (req.method === 'GET') {
      req.query = dtoInstance as unknown as Request['query'];
    } else {
      req.body = dtoInstance;
    }
    next();
  };
