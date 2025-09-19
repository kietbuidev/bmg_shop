import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import CategoryService from '../services/categoryService';
import {CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto} from '../database/models/dtos/categoryDto';
import {CustomError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Service()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as CategoryQueryDto;
      const categories = await this.categoryService.list(query);

      res.status(200).json(BuildResponse.get(categories));
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id);
      const category = await this.categoryService.getById(id);

      res.status(200).json(
        BuildResponse.get({
          data: category,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateCategoryDto;
      const category = await this.categoryService.create(payload);

      res.status(201).json(
        BuildResponse.created({
          data: category,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id);
      const payload = req.body as UpdateCategoryDto;
      const category = await this.categoryService.update(id, payload);

      res.status(200).json(
        BuildResponse.updated({
          data: category,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id);
      await this.categoryService.remove(id);

      res.status(200).json(
        BuildResponse.deleted({
          data: {id},
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  // private func
private parseId(idParam: string): string {
  const id = idParam?.trim();

  // Kiểm tra rỗng
  if (!id) {
    throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_CATEGORY_ID');
  }

  // Nếu bạn muốn check đúng UUID v4
  if (!uuidValidate(id) || uuidVersion(id) !== 4) {
    throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_CATEGORY_ID');
  }

  return id;
}
}

export default CategoryController;
