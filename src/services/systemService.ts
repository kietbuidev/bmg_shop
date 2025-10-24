import {Service} from 'typedi';
import {v2 as cloudinary, UploadApiOptions, UploadApiResponse} from 'cloudinary';
import path from 'path';
import streamifier from 'streamifier';
import {decodeBase64Image} from '../utils/service';
import {CustomError} from '../utils/customError';
import {HTTPCode, UploadImageType} from '../utils/enums';
import {logger} from '../utils/logger';
import ProvinceRepository from '../database/repositories/province';
import DistrictRepository from '../database/repositories/district';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_DEFAULT_FOLDER = process.env.CLOUDINARY_FOLDER;

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
  private readonly provinceRepository: ProvinceRepository;
  private readonly districtRepository: DistrictRepository;
  private readonly cloudinaryConfigured: boolean;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
    this.districtRepository = new DistrictRepository();

    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true,
      });
      this.cloudinaryConfigured = true;
    } else {
      this.cloudinaryConfigured = false;
      logger.warn('Cloudinary credentials are not fully configured; upload image feature is disabled.');
    }
  }

  async uploadImage(options: UploadOptions = {}) {
    console.log('Cloudinary ENV check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
      api_key: process.env.CLOUDINARY_API_KEY || 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
    });

    if (!this.cloudinaryConfigured) {
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'CLOUDINARY_CREDENTIALS_NOT_FOUND');
    }

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

    const targetFolder = options.folderId ?? mappedFolder ?? CLOUDINARY_DEFAULT_FOLDER;

    const providedName = options.fileName?.trim() || options.originalName?.trim();
    const providedExt = providedName ? path.extname(providedName) : '';
    const nameWithoutExt = providedName ? (providedExt ? providedName.slice(0, -providedExt.length) : providedName) : undefined;
    const sanitizedName = nameWithoutExt ? this.sanitizeFileName(nameWithoutExt) : undefined;
    let finalExtension = providedExt ? providedExt.replace('.', '') : extension;
    finalExtension = finalExtension ? finalExtension.toLowerCase() : undefined;
    const hasCustomName = Boolean(sanitizedName && providedName);
    const publicId = sanitizedName && sanitizedName.length > 0 ? sanitizedName : this.generateDefaultName();

    const uploadOptions: UploadApiOptions = {
      resource_type: 'image',
      public_id: publicId,
      overwrite: hasCustomName,
    };

    if (targetFolder) {
      uploadOptions.folder = targetFolder;
    }

    if (finalExtension) {
      uploadOptions.format = finalExtension;
    }

    let result: UploadApiResponse;

    try {
      if (hasBase64) {
        result = await cloudinary.uploader.upload(options.base64 as string, uploadOptions);
      } else {
        result = await this.uploadBuffer(buffer, uploadOptions);
      }
    } catch (error) {
      logger.error(`Failed to upload image to Cloudinary: ${(error as Error)?.message}`);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'UPLOAD_IMAGE_FAILED', (error as Error)?.message ?? error);
    }

    const secureUrl = result.secure_url ?? result.url;
    const computedMimeType = result.resource_type === 'image' && result.format ? `image/${result.format}` : contentType ?? 'application/octet-stream';

    return {
      id: result.public_id,
      assetId: result.asset_id,
      name: result.public_id,
      originalFilename: result.original_filename,
      folder: result.folder,
      format: result.format,
      resourceType: result.resource_type,
      mimeType: computedMimeType,
      size: result.bytes ?? buffer.length,
      width: result.width,
      height: result.height,
      url: result.url,
      secureUrl,
      webViewLink: secureUrl,
      downloadLink: secureUrl,
    };
  }

  async listProvinces() {
    return this.provinceRepository.findByOptions({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
  }

  async listDistrictsByProvince(provinceId: string) {
    if (!provinceId) {
      throw new CustomError(HTTPCode.REQUIRED, 'PROVINCE_ID_REQUIRED');
    }

    const province = await this.provinceRepository.getById(provinceId);
    if (!province) {
      throw new CustomError(HTTPCode.NOT_FOUND, 'PROVINCE_NOT_FOUND');
    }

    return this.districtRepository.findByOptions({
      where: {province_id: provinceId},
      attributes: ['id', 'name', 'description', 'province_id'],
      order: [['name', 'ASC']],
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

  private sanitizeFileName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateDefaultName() {
    return `image-${Date.now()}`;
  }

  private uploadBuffer(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('UPLOAD_IMAGE_FAILED'));
          return;
        }
        resolve(result);
      });

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}

export default SystemService;
