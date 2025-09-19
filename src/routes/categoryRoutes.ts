import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import {CategoryController} from '../controllers/categoryController';
import {validateDto} from '../middleware/validateDto';
import {CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto} from '../database/models/dtos/categoryDto';

@Service()
export class CategoryRouter {
  private readonly router: Router;

  constructor(private readonly categoryController: CategoryController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/',
      validateDto(CategoryQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.categoryController.list(req, res, next);
      },
    );

    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.categoryController.detail(req, res, next);
      },
    );

    this.router.post(
      '/',
      validateDto(CreateCategoryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.categoryController.create(req, res, next);
      },
    );

    this.router.put(
      '/:id',
      validateDto(UpdateCategoryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.categoryController.update(req, res, next);
      },
    );

    this.router.delete(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.categoryController.remove(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

/**
 * @openapi
 * '/api/categories':
 *  get:
 *     tags:
 *     - Categories
 *     summary: List categories
 *     description: Retrieve categories with pagination and optional filters
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
 *        name: parent_id
 *        schema:
 *          type: integer
 *          nullable: true
 *      - in: query
 *        name: include_inactive
 *        schema:
 *          type: boolean
 *          example: false
 *      - in: query
 *        name: is_popular
 *        schema:
 *          type: boolean
 *          example: true
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
 *              $ref: '#/components/schemas/CategoryListResponse'
 */

/**
 * @openapi
 * '/api/categories/{id}':
 *  get:
 *     tags:
 *     - Categories
 *     summary: Get category detail
 *     description: Retrieve a single category by id
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryDetailResponse'
 *      404:
 *        description: Category not found
 */

/**
 * @openapi
 * '/api/categories':
 *  post:
 *     tags:
 *     - Categories
 *     summary: Create category
 *     description: Create a new category
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CategoryCreateInput'
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryDetailResponse'
 *      400:
 *        description: Validation error
 */

/**
 * @openapi
 * '/api/categories/{id}':
 *  put:
 *     tags:
 *     - Categories
 *     summary: Update category
 *     description: Update an existing category
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CategoryUpdateInput'
 *     responses:
 *      200:
 *        description: Updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryDetailResponse'
 *      400:
 *        description: Validation error
 *      404:
 *        description: Category not found
 */

/**
 * @openapi
 * '/api/categories/{id}':
 *  delete:
 *     tags:
 *     - Categories
 *     summary: Delete category
 *     description: Soft delete a category
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *      200:
 *        description: Deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryDeleteResponse'
 *      404:
 *        description: Category not found
 */
