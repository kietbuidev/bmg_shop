import {Service} from 'typedi';
import path from 'path';
import {v2 as cloudinary, UploadApiOptions, UploadApiResponse} from 'cloudinary';
import streamifier from 'streamifier';
import {decodeBase64Image} from '../utils/service';
import {CustomError} from '../utils/customError';
import {HTTPCode, UploadImageType} from '../utils/enums';
import {logger} from '../utils/logger';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_ROOT_FOLDER = process.env.CLOUDINARY_FOLDER;

interface UploadOptions {
  base64?: string;
  buffer?: Buffer;
  contentType?: string;
  originalName?: string;
  type?: UploadImageType;
  folderId?: string;
  fileName?: string;
}

@Service()
export class SystemService {
  constructor() {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'CLOUDINARY_CREDENTIALS_NOT_FOUND');
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(options: UploadOptions = {}) {
    const hasBase64 = Boolean(options.base64);
    const hasBuffer = Boolean(options.buffer);

    if (!hasBase64 && !hasBuffer) {
      throw new CustomError(HTTPCode.REQUIRED, 'IMAGE_SOURCE_REQUIRED');
    }

    let buffer: Buffer;
    let contentType: string;
    let extension: string | undefined;

    if (hasBase64) {
      const decoded = decodeBase64Image(options.base64 as string);
      buffer = decoded.buffer;
      contentType = decoded.contentType;
      extension = decoded.extension;
    } else {
      buffer = options.buffer as Buffer;
      contentType = options.contentType || 'application/octet-stream';
      extension = contentType.includes('/') ? contentType.split('/')[1] : undefined;
    }

    const mappedFolder = options.type ? this.resolveFolder(options.type) : undefined;
    if (options.type && !mappedFolder) {
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'CLOUDINARY_FOLDER_NOT_CONFIGURED', {type: options.type});
    }

    const targetFolder = options.folderId ?? mappedFolder ?? CLOUDINARY_ROOT_FOLDER;

    const providedName = options.fileName?.trim() || options.originalName?.trim();
    const baseName = providedName && providedName.length > 0 ? providedName : `image-${Date.now()}`;
    const currentExt = path.extname(baseName);
    const nameWithoutExt = currentExt ? baseName.slice(0, -currentExt.length) : baseName.replace(/\.+$/, '');
    const finalExtension = currentExt ? currentExt.replace('.', '') : extension;
    const publicId = this.sanitizePublicId(nameWithoutExt);

    try {
      const uploadOptions: UploadApiOptions = {
        folder: targetFolder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
        use_filename: false,
        unique_filename: false,
      };

      if (finalExtension) {
        uploadOptions.format = finalExtension.toLowerCase();
      }

      const uploadResult = hasBase64
        ? await cloudinary.uploader.upload(options.base64 as string, uploadOptions)
        : await this.uploadBuffer(buffer, uploadOptions);

      return {
        id: uploadResult.public_id,
        name: uploadResult.original_filename ?? publicId,
        mimeType:
          uploadResult.resource_type && uploadResult.format
            ? `${uploadResult.resource_type}/${uploadResult.format}`
            : contentType,
        size: uploadResult.bytes ?? buffer.length,
        width: uploadResult.width ?? undefined,
        height: uploadResult.height ?? undefined,
        webViewLink: uploadResult.secure_url ?? uploadResult.url,
        downloadLink: uploadResult.secure_url ?? uploadResult.url,
      };
    } catch (error) {
      logger.error(`Failed to upload image to Cloudinary: ${(error as Error)?.message}`);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'UPLOAD_IMAGE_FAILED', (error as Error)?.message ?? error);
    }
  }

  private uploadBuffer(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Empty response from Cloudinary'));
          return;
        }

        resolve(result);
      });

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  private resolveFolder(type: UploadImageType): string | undefined {
    const mapping: Record<UploadImageType, string | undefined> = {
      [UploadImageType.CATEGORIES]: process.env.CLOUDINARY_FOLDER_CATEGORIES,
      [UploadImageType.POSTS]: process.env.CLOUDINARY_FOLDER_POSTS,
      [UploadImageType.PRODUCTS]: process.env.CLOUDINARY_FOLDER_PRODUCTS,
    };

    return mapping[type];
  }

  private sanitizePublicId(input: string): string {
    const cleaned = input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    return cleaned.length > 0 ? cleaned : `image-${Date.now()}`;
  }
}

export default SystemService;
