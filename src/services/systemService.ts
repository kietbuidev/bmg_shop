import {Service} from 'typedi';
import {google, drive_v3, Auth} from 'googleapis';
import {Readable} from 'stream';
import path from 'path';
import {decodeBase64Image} from '../utils/service';
import {CustomError} from '../utils/customError';
import {HTTPCode, UploadImageType} from '../utils/enums';
import {logger} from '../utils/logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

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
  private readonly drive: drive_v3.Drive;
  private readonly auth: Auth.OAuth2Client;

  constructor() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_REDIRECT_URI) {
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'GOOGLE_OAUTH_CREDENTIALS_NOT_FOUND');
    }

    this.auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
    this.auth.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN,
    });

    this.drive = google.drive({version: 'v3', auth: this.auth});
  }

  async uploadImageToDrive(options: UploadOptions = {}) {
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

    const mappedFolderId = options.type ? this.resolveFolderId(options.type) : undefined;
    if (options.type && !mappedFolderId) {
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'DRIVE_FOLDER_NOT_CONFIGURED', {type: options.type});
    }

    const ROOT_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

    const targetFolderId = options.folderId ?? mappedFolderId ?? ROOT_ID;

    const providedName = options.fileName?.trim() || options.originalName?.trim();
    const baseName = providedName && providedName.length > 0 ? providedName : `image-${Date.now()}`;
    const currentExt = path.extname(baseName);
    const nameWithoutExt = currentExt ? baseName.slice(0, -currentExt.length) : baseName.replace(/\.+$/, '');
    const finalExtension = currentExt ? currentExt.replace('.', '') : extension;
    const fileName = finalExtension ? `${nameWithoutExt}.${finalExtension}` : nameWithoutExt;

    try {
      const created = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: targetFolderId ? [targetFolderId] : undefined,
        },
        media: {
          mimeType: contentType,
          body: Readable.from(buffer),
        },
        fields: 'id, name, mimeType, size',
      });

      const fileId = created.data.id;
      if (!fileId) {
        throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'UPLOAD_IMAGE_FAILED');
      }

      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });

      const detail = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink',
      });

      return {
        id: detail.data.id,
        name: detail.data.name ?? fileName,
        mimeType: detail.data.mimeType ?? contentType,
        size: detail.data.size ? Number(detail.data.size) : buffer.length,
        webViewLink: detail.data.webViewLink,
        downloadLink: detail.data.webContentLink,
      };
    } catch (error) {
      logger.error(`Failed to upload image to Google Drive: ${(error as Error)?.message}`);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'UPLOAD_IMAGE_FAILED', (error as Error)?.message ?? error);
    }
  }

  private resolveFolderId(type: UploadImageType): string | undefined {
    const mapping: Record<UploadImageType, string | undefined> = {
      [UploadImageType.CATEGORIES]: process.env.DRIVE_FOLDER_CATEGORIES,
      [UploadImageType.POSTS]: process.env.DRIVE_FOLDER_POSTS,
      [UploadImageType.PRODUCTS]: process.env.DRIVE_FOLDER_PRODUCTS,
    };

    return mapping[type];
  }
}

export default SystemService;
