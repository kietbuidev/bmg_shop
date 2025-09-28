import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import {validate as uuidValidate, version as uuidVersion} from 'uuid';
import BuildResponse from '../utils/buildResponse';
import PostService from '../services/postService';
import {CreatePostDto, PostQueryDto, UpdatePostDto} from '../database/models/dtos/postDto';
import {CustomError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';

@Service()
export class PostController {
  constructor(private readonly postService: PostService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as PostQueryDto;
      const result = await this.postService.list(query);

      res.status(200).json(BuildResponse.get(result));
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_POST_ID');
      const post = await this.postService.getById(id);

      res.status(200).json(
        BuildResponse.get({
          data: post,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async detailBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = this.parseSlug(req.params.slug, 'INVALID_POST_SLUG');
      const post = await this.postService.getBySlug(slug);

      res.status(200).json(
        BuildResponse.get({
          data: post,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreatePostDto;
      const post = await this.postService.create(payload);

      res.status(201).json(
        BuildResponse.created({
          data: post,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_POST_ID');
      const payload = req.body as UpdatePostDto;
      const post = await this.postService.update(id, payload);

      res.status(200).json(
        BuildResponse.updated({
          data: post,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_POST_ID');
      await this.postService.remove(id);

      res.status(200).json(
        BuildResponse.deleted({
          data: {id},
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  private parseId(idParam: string, errorCode: string): string {
    const id = idParam?.trim();

    if (!id) {
      throw new CustomError(HTTPCode.BAD_REQUEST, errorCode);
    }

    if (!uuidValidate(id) || uuidVersion(id) !== 4) {
      throw new CustomError(HTTPCode.BAD_REQUEST, errorCode);
    }

    return id;
  }

  private parseSlug(slugParam: string, errorCode: string): string {
    const slug = slugParam?.trim();

    if (!slug) {
      throw new CustomError(HTTPCode.BAD_REQUEST, errorCode);
    }

    return slug;
  }
}

export default PostController;
