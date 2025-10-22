import {Service} from 'typedi';
import {FindOptions, Op} from 'sequelize';
import slug from 'slug';
import Product from '../database/models/product';
import ProductRepository from '../database/repositories/product';
import CategoryRepository from '../database/repositories/category';
import Category from '../database/models/category';
import {CreateProductDto, ProductQueryDto, UpdateProductDto} from '../database/models/dtos/productDto';
import {CustomError, NotFoundError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';
import {IPaginateResult} from '../utils/types';

@Service()
export class ProductService {
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
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

  private normalizeArray(input: unknown, fallback: unknown[] | undefined): unknown[] | undefined {
    if (input === undefined) {
      return fallback;
    }

    if (input === null) {
      return [];
    }

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
      return [input];
    }

    return [input];
  }

  private normalizeNullableString(input: string | null | undefined): string | null | undefined {
    if (input === undefined) {
      return undefined;
    }

    if (input === null) {
      return null;
    }

    const trimmed = input.trim();
    return trimmed ? trimmed : null;
  }

  private normalizeSourceType(input: string | undefined): string | undefined {
    if (input === undefined || input === null) {
      return undefined;
    }

    const normalized = String(input).trim().toUpperCase();
    return normalized ? normalized : undefined;
  }

  private normalizeStatusArray(input: unknown, fallback: string[] | undefined): string[] | undefined {
    const normalized = this.normalizeArray(input, fallback);
    if (normalized === undefined) {
      return fallback;
    }

    const values = Array.isArray(normalized) ? [...normalized] : [];
    return values
      .map(item => (typeof item === 'string' ? item.trim().toUpperCase() : item))
      .filter((item): item is string => typeof item === 'string' && item.length > 0);
  }

  private async ensureUniqueCode(code: string, excludeId?: string): Promise<void> {
    const model = this.productRepository.getModel().scope(null);
    const where: Record<string, unknown> = {code};

    if (excludeId) {
      where.id = {
        [Op.ne]: excludeId,
      };
    }

    const existing = await model.findOne({where, paranoid: false});
    if (existing) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'PRODUCT_CODE_DUPLICATED');
    }
  }

  private async validateCategory(categoryId?: string): Promise<string | undefined> {
    if (categoryId === undefined) {
      return undefined;
    }

    if (!categoryId) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'PRODUCT_CATEGORY_REQUIRED');
    }

    const category = await this.categoryRepository.getModel().scope('withInactive').findByPk(categoryId);
    if (!category) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'PRODUCT_CATEGORY_NOT_FOUND');
    }

    return categoryId;
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
    const model = this.productRepository.getModel().scope('withInactive');

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

  private async findByIdOrThrow(id: string): Promise<Product> {
    const product = await this.productRepository.getModel().scope('withInactive').findByPk(id);
    if (!product) {
      throw new NotFoundError('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  private async findBySlugOrThrow(slugValue: string): Promise<Product> {
    const trimmedSlug = slugValue.trim();
    const product = await this.productRepository
      .getModel()
      .scope(['withInactive', {method: ['bySlug', trimmedSlug]}])
      .findOne({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug', 'description', 'thumbnail', 'gallery', 'priority'],
          },
        ],
      });
      console.log(1);
    if (!product) {
      throw new NotFoundError('PRODUCT_NOT_FOUND');
    }

    return product;
  }

  private async findCategoryBySlugOrThrow(slugValue: string): Promise<Category> {
    const trimmedSlug = slugValue.trim();
    const category = await this.categoryRepository
      .getModel()
      .scope(['withInactive', {method: ['bySlug', trimmedSlug]}])
      .findOne();

    if (!category) {
      throw new NotFoundError('CATEGORY_NOT_FOUND');
    }

    return category;
  }

  async list(query: ProductQueryDto): Promise<IPaginateResult<Product>> {
    const {page = 1, limit = 10, category_id, status, search, source_type} = query;

    const where: {[key: string]: unknown; [key: symbol]: unknown} = {};

    if (category_id) {
      where.category_id = category_id;
    }

    const statusFilter = status ? status.toUpperCase() : undefined;
    if (statusFilter) {
      where.status = {
        [Op.contains]: [statusFilter],
      };
    }

    if (source_type) {
      where.source_type = source_type;
    }

    if (search) {
      where[Op.or] = [{name: {[Op.iLike]: `%${search}%`}}, {slug: {[Op.iLike]: `%${search}%`}}, {code: {[Op.iLike]: `%${search}%`}}];
    }

    const options: FindOptions = {
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description', 'thumbnail', 'gallery', 'priority'],
        },
      ],
      order: [['name', 'ASC']],
    };

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const offset = pageNumber > 1 ? (pageNumber - 1) * limitNumber : 0;

      const scopedModel = this.productRepository.getModel().scope('withInactive');
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
        rows: rows as Product[],
      };
  }

  async listByCategory(categoryId: string, query: {}): Promise<Product[]> {

    const scopes: any[] = [{method: ['byCategory', categoryId]}];
 
    return this.productRepository
      .getModel()
      .scope(...scopes)
      .findAll({
        include: [{model: Category, as: 'category'}],
        order: [['name', 'ASC']],
      });
  }

  async listByCategorySlug(categorySlug: string, query: {}): Promise<Product[]> {
    const category = await this.findCategoryBySlugOrThrow(categorySlug);

    return this.listByCategory(category.id, query);
  }

  async getById(id: string, incrementView: boolean = false): Promise<Product> {
    const product = await this.findByIdOrThrow(id);

    if (incrementView) {
      await product.increment('view_count', {by: 1});
      await product.reload();
    }

    return product;
  }

  async getBySlug(productSlug: string, incrementView: boolean = false): Promise<Product> {
    const product = await this.findBySlugOrThrow(productSlug);

    if (incrementView) {
      await product.increment('view_count', {by: 1});
      await product.reload();
    }

    return product;
  }

  async create(payload: CreateProductDto): Promise<Product> {
    const normalizedName = payload.name.trim();
    const normalizedCode = payload.code.trim();

    await this.ensureUniqueCode(normalizedCode);

    const categoryId = await this.validateCategory(payload.category_id);
    const slugValue = await this.resolveSlug(normalizedName);
    const gallery = this.normalizeArray(payload.gallery, []);
    const sizes = this.normalizeArray(payload.sizes, []);
    const colors = this.normalizeArray(payload.colors, []);
    const style = this.normalizeNullableString(payload.style);
    const status = this.normalizeStatusArray(payload.status, []);
    const sourceType = this.normalizeSourceType(payload.source_type) ?? 'IN_HOUSE';

    const data = this.sanitizePayload({
      ...payload,
      name: normalizedName,
      code: normalizedCode,
      category_id: categoryId,
      slug: slugValue,
      gallery,
      sizes,
      colors,
      style,
      status,
      source_type: sourceType,
      regular_price: payload.regular_price ?? 0,
      sale_price: payload.sale_price ?? 0,
      percent: payload.percent ?? 0,
      currency: payload.currency ?? 'VND',
      is_active: payload.is_active ?? true,
    });

    const product = await this.productRepository.create(data as Product);
    return this.getById(product.id);
  }

  async update(id: string, payload: UpdateProductDto): Promise<Product> {
    const current = await this.findByIdOrThrow(id);
    const categoryId = await this.validateCategory(payload.category_id);
    const gallery = this.normalizeArray(payload.gallery, undefined);
    const sizes = this.normalizeArray(payload.sizes, undefined);
    const colors = this.normalizeArray(payload.colors, undefined);
    const style = this.normalizeNullableString(payload.style);
    const status = this.normalizeStatusArray(payload.status, undefined);
    const sourceType = this.normalizeSourceType(payload.source_type);

    let name = payload.name;
    if (name !== undefined) {
      name = name.trim();
      if (!name) {
        throw new CustomError(HTTPCode.BAD_REQUEST, 'PRODUCT_NAME_REQUIRED');
      }
    }

    let code = payload.code;
    if (code !== undefined) {
      code = code.trim();
      if (!code) {
        throw new CustomError(HTTPCode.BAD_REQUEST, 'PRODUCT_CODE_REQUIRED');
      }
      if (code !== current.code) {
        await this.ensureUniqueCode(code, id);
      }
    }

    const baseName = name ?? current.name;
    const slugValue = await this.resolveSlug(baseName, undefined, id);

    const data = this.sanitizePayload({
      ...payload,
      name,
      code,
      category_id: categoryId,
      gallery,
      sizes,
      colors,
      style,
      status,
      source_type: sourceType,
      slug: slugValue,
    });
    const [affected] = await this.productRepository.update(id, data as Partial<Product>);
    if (!affected) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'PRODUCT_NOT_UPDATED');
    }

    return this.getById(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.productRepository.delete(id);
  }
}

export default ProductService;
