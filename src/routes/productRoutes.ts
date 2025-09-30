import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import ProductController from '../controllers/productController';
import {validateDto} from '../middleware/validateDto';
import {CreateProductDto, ProductQueryDto, UpdateProductDto} from '../database/models/dtos/productDto';

@Service()
export class ProductRouter {
  private readonly router: Router;

  constructor(private readonly productController: ProductController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/',
      validateDto(ProductQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.list(req, res, next);
      },
    );

    this.router.get(
      '/category/slug/:slug',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.listByCategorySlug(req, res, next);
      },
    );

    this.router.get(
      '/category/:categoryId',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.listByCategory(req, res, next);
      },
    );

    this.router.get(
      '/slug/:slug',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.detailBySlug(req, res, next);
      },
    );

    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.detail(req, res, next);
      },
    );

    this.router.post(
      '/',
      validateDto(CreateProductDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.create(req, res, next);
      },
    );

    this.router.put(
      '/:id',
      validateDto(UpdateProductDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.update(req, res, next);
      },
    );

    this.router.delete(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.productController.remove(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default ProductRouter;

/**
 * @openapi
 * '/api/products':
 *  get:
 *     tags:
 *     - Products
 *     summary: List products
 *     description: Retrieve products with pagination and optional filters
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
 *        name: category_id
 *        schema:
 *          type: string
 *          format: uuid
 *      - in: query
 *        name: is_popular
 *        schema:
 *          type: boolean
 *          example: true
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *          example: published
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *          example: dress
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductListResponse'
 */

/**
 * @openapi
 * '/api/products/category/{categoryId}':
 *  get:
 *     tags:
 *     - Products
 *     summary: List products by category
 *     description: Retrieve products filtered by category id
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: categoryId
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
 *              $ref: '#/components/schemas/ProductListByCategoryResponse'
 *      404:
 *        description: Category not found
 */

/**
 * @openapi
 * '/api/products/category/slug/{slug}':
 *  get:
 *     tags:
 *     - Products
 *     summary: List products by category slug
 *     description: Retrieve products filtered by category slug
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: slug
 *        required: true
 *        schema:
 *          type: string
 *          example: nu-gu
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductListByCategoryResponse'
 *      404:
 *        description: Category not found
 */

/**
 * @openapi
 * '/api/products/{id}':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get product detail
 *     description: Retrieve product detail and increment view count
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
 *              $ref: '#/components/schemas/ProductDetailResponse'
 *      404:
 *        description: Product not found
 */

/**
 * @openapi
 * '/api/products/slug/{slug}':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get product detail by slug
 *     description: Retrieve product detail by slug and increment view count
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: slug
 *        required: true
 *        schema:
 *          type: string
 *          example: vay-midi-den
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductDetailResponse'
 *      404:
 *        description: Product not found
 */

/**
 * @openapi
 * '/api/products':
 *  post:
 *     tags:
 *     - Products
 *     summary: Create product
 *     description: Create a new product. The slug is generated automatically from the provided name.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductCreateInput'
 *          example:
 *            name: "Minimal Dress"
 *            code: "MD-001"
 *            category_id: null
 *            description: "Elegant minimal dress for summer."
 *            short_description: "Minimal summer dress"
 *            content: "<p>Detailed HTML description</p>"
 *            material:
 *              - "Cotton"
 *              - "Linen"
 *            style: "Casual"
 *            status: "published"
 *            thumbnail: "mg/thumbnail-1.jpg"
 *            gallery:
 *              - "img/gallery-1.jpg"
 *              - "img/gallery-2.jpg"
 *            colors:
 *              - "red"
 *              - "black"
 *            regular_price: 299000
 *            sale_price: 249000
 *            percent: 20
 *            currency: "VND"
 *            sizes:
 *              - "S"
 *              - "M"
 *              - "L"
 *            is_active: true
 *            is_popular: false
 *            priority: 5
 *            meta_title: "Minimal Dress"
 *            meta_keyword: "dress,minimal"
 *            meta_description: "Minimalist dress product meta"
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductDetailResponse'
 *      400:
 *        description: Validation error
 */

/**
 * @openapi
 * '/api/products/{id}':
 *  put:
 *     tags:
 *     - Products
 *     summary: Update product
 *     description: Update an existing product. If the name changes, the slug is regenerated automatically to match.
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
 *            $ref: '#/components/schemas/ProductUpdateInput'
 *          example:
 *            name: "Minimal Dress (Updated)"
 *            description: "Updated description for the minimal dress."
 *            sale_price: 219000
 *            percent: 30
 *            material:
 *              - "Linen"
 *              - "Viscose"
 *            style: "Summer"
 *            status: "draft"
 *            colors:
 *              - "red"
 *              - "white"
 *            sizes:
 *              - "S"
 *              - "L"
 *            is_active: true
 *            is_popular: true
 *            priority: 10
 *            note: "Only fields provided will be updated"
 *     responses:
 *      200:
 *        description: Updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductDetailResponse'
 *      400:
 *        description: Validation error
 *      404:
 *        description: Product not found
 */

/**
 * @openapi
 * '/api/products/{id}':
 *  delete:
 *     tags:
 *     - Products
 *     summary: Delete product
 *     description: Soft delete a product
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
 *              $ref: '#/components/schemas/ProductDeleteResponse'
 *      404:
 *        description: Product not found
 */
