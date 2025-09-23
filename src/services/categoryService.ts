import {Service} from 'typedi';
import {Op} from 'sequelize';
import type {FindOptions} from 'sequelize';
import slug from 'slug';
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

  private normalizeGallery(input?: unknown): unknown[] {
    if (Array.isArray(input)) {
      return input;
    }

    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        return [input];
      }
    }

    if (input === undefined || input === null) {
      return [];
    }

    return [input];
  }

  private async resolveSlug(name?: string | null, requested?: string | null, excludeId?: string): Promise<string | undefined> {
    const source = (requested ?? name ?? '').trim();
    if (!source) {
      return undefined;
    }

    const base = slug(source, {lower: true});
    if (!base) {
      return undefined;
    }

    let candidate = base;
    let suffix = 1;
    const model = this.categoryRepository.getModel().scope('withInactive');

    while (true) {
      const where: Record<string, unknown> = {slug: candidate};
      if (excludeId) {
        where.id = {
          [Op.ne]: excludeId,
        };
      }

      const existing = await model.findOne({where});
      if (!existing) {
        return candidate;
      }
      candidate = `${base}-${suffix++}`;
    }
  }

  private async validateParent(parentId?: string | null, selfId?: string): Promise<string | null | undefined> {
    if (parentId === undefined) {
      return undefined;
    }

    if (parentId === null) {
      return null;
    }

    if (parentId === "") {
      return null;
    }

    if (selfId && parentId === selfId) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'CATEGORY_PARENT_INVALID');
    }

    const parent = await this.categoryRepository.getModel().scope('withInactive').findByPk(parentId);
    if (!parent) {
      throw new NotFoundError('PARENT_CATEGORY_NOT_FOUND');
    }

    return parentId;
  }

  private async findByIdOrThrow(id: string): Promise<Category> {
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
    const {page = 1, limit = 10, parent_id, is_popular, search} = query;

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

  async getById(id: string): Promise<Category> {
    return this.findByIdOrThrow(id);
  }

  async create(payload: CreateCategoryDto): Promise<Category> {
    const parentId = await this.validateParent(payload.parent_id ?? null);
    const slug = await this.resolveSlug(payload.name, payload.slug);
    const gallery = this.normalizeGallery(payload.gallery);

    const data = this.sanitizePayload({
      ...payload,
      parent_id: parentId,
      slug,
      gallery,
      is_active: payload.is_active ?? true,
      is_popular: payload.is_popular ?? false,
      priority: payload.priority ?? 0,
    });

    const category = await this.categoryRepository.create(data as Category);
    return this.findByIdOrThrow(category.id);
  }

  async update(id: string, payload: UpdateCategoryDto): Promise<Category> {
    const current = await this.findByIdOrThrow(id);

    const parentId = await this.validateParent(payload.parent_id, id);
    const gallery = payload.gallery !== undefined ? this.normalizeGallery(payload.gallery) : undefined;
    const slug = await this.resolveSlug(payload.name ?? current.name, payload.slug, id);

    const data = this.sanitizePayload({
      ...payload,
      parent_id: parentId,
      gallery,
      slug,
    });

    const [affected] = await this.categoryRepository.update(id, data as Partial<Category>);
    if (!affected) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'CATEGORY_NOT_UPDATED');
    }

    return this.findByIdOrThrow(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.categoryRepository.delete(id);
  }
}

export default CategoryService;
