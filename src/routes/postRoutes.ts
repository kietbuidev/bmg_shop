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

/**
 * @openapi
 * '/api/posts':
 *  get:
 *     tags:
 *     - Posts
 *     summary: List posts
 *     description: Retrieve posts with pagination and optional filters
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          example: 1
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          example: 10
 *      - in: query
 *        name: is_active
 *        schema:
 *          type: boolean
 *      - in: query
 *        name: is_popular
 *        schema:
 *          type: boolean
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *          example: fashion
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostListResponse'
 */

/**
 * @openapi
 * '/api/posts/{id}':
 *  get:
 *     tags:
 *     - Posts
 *     summary: Get post detail
 *     description: Retrieve a post by id
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostDetailResponse'
 *      404:
 *        description: Post not found
 */

/**
 * @openapi
 * '/api/posts':
 *  post:
 *     tags:
 *     - Posts
 *     summary: Create post
 *     description: Create a new post entry. The slug is generated automatically from the post title.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PostCreateInput'
 *          example:
 *            post_title: "Summer Fashion Trends"
 *            post_description: "Highlights from the latest runway shows"
 *            post_content: "<p>Highlights from the latest runway shows with styling tips.</p>"
 *            is_active: true
 *            thumbnail: "img/blog/summer-thumb.jpg"
 *            post_tag: "fashion,summer,style"
 *            meta_title: "Summer Fashion Trends | BMG"
 *            meta_keyword: "fashion,summer,style"
 *            meta_description: "Top summer fashion trends for this season."
 *            gallery:
 *              - "img/blog/summer-1.jpg"
 *              - "img/blog/summer-2.jpg"
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostDetailResponse'
 */

/**
 * @openapi
 * '/api/posts/{id}':
 *  put:
 *     tags:
 *     - Posts
 *     summary: Update post
 *     description: Update an existing post by id. If the title changes, the slug is regenerated automatically.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PostUpdateInput'
 *          example:
 *            post_title: "Updated summer trends"
 *            post_content: "<p>Updated summer trends content.</p>"
 *            is_popular: true
 *            post_tag: "summer,trends"
 *            meta_title: "Updated Summer Fashion Trends"
 *            meta_description: "Refreshed overview of the latest trends."
 *            thumbnail: "img/blog/updated-summer-thumb.jpg"
 *     responses:
 *      200:
 *        description: Updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostDetailResponse'
 *      404:
 *        description: Post not found
 */

/**
 * @openapi
 * '/api/posts/{id}':
 *  delete:
 *     tags:
 *     - Posts
 *     summary: Delete post
 *     description: Remove a post by id
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     responses:
 *      200:
 *        description: Deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostDeleteResponse'
 *      404:
 *        description: Post not found
 */
