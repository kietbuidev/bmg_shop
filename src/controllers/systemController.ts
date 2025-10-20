import type { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import SystemService from '../services/systemService';
import BuildResponse from '../utils/buildResponse';
import { CustomError } from '../utils/customError';
import { HTTPCode, UploadImageType } from '../utils/enums';

@Service()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = ((req as any).validated ?? req.body) as {
        image_base64?: string;
        type?: UploadImageType;
        folder_id?: string;
        file_name?: string;
      };
      const file = (req as any).file as Express.Multer.File | undefined;

      if (!payload.image_base64 && !file) {
        throw new CustomError(HTTPCode.REQUIRED, 'IMAGE_SOURCE_REQUIRED');
      }

      const result = await this.systemService.uploadImage({
        base64: payload.image_base64,
        buffer: file?.buffer,
        contentType: file?.mimetype,
        originalName: file?.originalname,
        type: payload.type,
        folderId: payload.folder_id,
        fileName: payload.file_name,
      });

      res.status(201).json(BuildResponse.created({ data: result }));
    } catch (err) {
      next(err);
    }
  }
}

export default SystemController;
