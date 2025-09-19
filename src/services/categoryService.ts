import {Service} from 'typedi';
import {Op} from 'sequelize';
import type {FindOptions} from 'sequelize';
import Category from '../database/models/category';
import CategoryRepository from '../database/repositories/category';
import {CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto} from '../database/models/dtos/categoryDto';
import {IPaginateResult} from '../utils/types';
import {CustomError, NotFoundError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';

@Service()
export class CategoryService {
  private readonly categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  private sanitizePayload<T extends Record<string, unknown>>(payload: T): T {
    return Object.entries(payload).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as keyof T] = value as T[keyof T];
      }
      return acc;
    }, {} as T);
  }

  private async findByIdOrThrow(id: number): Promise<Category> {
    const category = await this.categoryRepository
      .getModel()
      .scope('withInactive')
      .findByPk(id);

    if (!category) {
      throw new NotFoundError('CATEGORY_NOT_FOUND');
    }

    return category;
  }

  async list(query: CategoryQueryDto): Promise<IPaginateResult<Category>> {
    const {page = 1, limit = 10, parent_id, include_inactive, is_popular, search} = query;

    const where: any = {};

    if (parent_id !== undefined && parent_id !== null) {
      where.parent_id = parent_id;
    }

    if (is_popular !== undefined) {
      where.is_popular = is_popular;
    }

    if (search) {
      where[Op.or] = [
        {name: {[Op.iLike]: `%${search}%`}},
        {slug: {[Op.iLike]: `%${search}%`}},
      ];
    }

    const options: FindOptions = {
      where,
      order: [
        ['priority', 'DESC'],
        ['name', 'ASC'],
      ],
    };

    if (include_inactive) {
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const offset = pageNumber > 1 ? (pageNumber - 1) * limitNumber : 0;

      const scopedModel = this.categoryRepository.getModel().scope('withInactive');
      const {count, rows} = await scopedModel.findAndCountAll({
        ...options,
        offset,
        limit: limitNumber,
      });

      const total_page = Math.ceil(count / limitNumber || 1);

      return {
        pagination: {
          total_page,
          per_page: limitNumber,
          current_page: pageNumber,
          count,
        },
        rows: rows as Category[],
      };
    }

    return this.categoryRepository.findAndPaginate(options, {
      page,
      limit,
    });
  }

  async getById(id: number): Promise<Category> {
    return this.findByIdOrThrow(id);
  }

  async create(payload: CreateCategoryDto): Promise<Category> {
    const data = this.sanitizePayload({
      ...payload,
      gallery: payload.gallery ?? [],
      is_active: payload.is_active ?? true,
      is_popular: payload.is_popular ?? false,
      priority: payload.priority ?? 0,
    });

    const category = await this.categoryRepository.create(data as Category);
    return this.findByIdOrThrow(category.id);
  }

  async update(id: number, payload: UpdateCategoryDto): Promise<Category> {
    await this.findByIdOrThrow(id);

    const data = this.sanitizePayload({...payload});

    const [affected] = await this.categoryRepository.update(id, data as Partial<Category>);
    if (!affected) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'CATEGORY_NOT_UPDATED');
    }

    return this.findByIdOrThrow(id);
  }

  async remove(id: number): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.categoryRepository.delete(id);
  }
}

export default CategoryService;
