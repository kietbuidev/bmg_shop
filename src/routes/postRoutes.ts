import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import PostController from '../controllers/postController';
import {validateDto} from '../middleware/validateDto';
import {CreatePostDto, PostQueryDto, UpdatePostDto} from '../database/models/dtos/postDto';

@Service()
export class PostRouter {
  private readonly router: Router;

  constructor(private readonly postController: PostController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/',
      validateDto(PostQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.postController.list(req, res, next);
      },
    );

    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.postController.detail(req, res, next);
      },
    );

    this.router.post(
      '/',
      validateDto(CreatePostDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.postController.create(req, res, next);
      },
    );

    this.router.put(
      '/:id',
      validateDto(UpdatePostDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.postController.update(req, res, next);
      },
    );

    this.router.delete(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.postController.remove(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default PostRouter;
