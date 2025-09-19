import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import {validate as uuidValidate, version as uuidVersion} from 'uuid';
import BuildResponse from '../utils/buildResponse';
import ProductService from '../services/productService';
import {CreateProductDto, ProductQueryDto, UpdateProductDto} from '../database/models/dtos/productDto';
import {CustomError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';

@Service()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as ProductQueryDto;
      const products = await this.productService.list(query);

      res.status(200).json(BuildResponse.get(products));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async listByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = this.parseId(req.params.categoryId, 'INVALID_CATEGORY_ID');
      const query = req.query as unknown;
      const products = await this.productService.listByCategory(categoryId, query);

      res.status(200).json(
        BuildResponse.get({
          data: products,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_PRODUCT_ID');
      const product = await this.productService.getById(id, true);

      res.status(200).json(
        BuildResponse.get({
          data: product,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateProductDto;
      const product = await this.productService.create(payload);

      res.status(201).json(
        BuildResponse.created({
          data: product,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_PRODUCT_ID');
      const payload = req.body as UpdateProductDto;
      const product = await this.productService.update(id, payload);

      res.status(200).json(
        BuildResponse.updated({
          data: product,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_PRODUCT_ID');
      await this.productService.remove(id);

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
}

export default ProductController;
