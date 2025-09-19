import {Request, Response, NextFunction} from 'express';
import {validate, ValidationError} from 'class-validator';
import {instanceToPlain, plainToClass, plainToInstance} from 'class-transformer';
import {logger} from '../utils/logger';
import {IConfig} from '../utils/types';
import {ConfigDefault, HTTPCode} from '../utils/enums';

export const validateDto =
  <T extends object>(dtoClass: new () => T) =>
  async (req: Request, res: Response, next: NextFunction) => {    
    const method = req.method.toUpperCase();
    const payload = method === 'GET' ? req.query : req.body;
    const dtoInstance = plainToInstance(dtoClass, payload, {
      exposeDefaultValues: true,
    });
    const errors = await validate(dtoInstance, {
        whitelist: true,
        skipMissingProperties: method === 'GET' || method === 'PATCH',
        validationError: { target: false, value: false },
      });
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
        message: formattedErrors.map((error) => error).join(', '),
        errors: formattedErrors,
        option: null,
      });
    }

    (req as any).validated = instanceToPlain(dtoInstance);

    next();
  };
