import {Service} from 'typedi';
import {FindOptions, Op} from 'sequelize';
import slugify from 'slug';
import PostRepository from '../database/repositories/post';
import Post from '../database/models/post';
import {CreatePostDto, PostQueryDto, UpdatePostDto} from '../database/models/dtos/postDto';
import {CustomError, NotFoundError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';
import {IPaginateResult} from '../utils/types';

@Service()
export class PostService {
  private readonly postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  private sanitizePayload<T extends Record<string, unknown>>(payload: T): T {
    return Object.entries(payload).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as keyof T] = value as T[keyof T];
      }
      return acc;
    }, {} as T);
  }

  private normalizeGallery(input: unknown, fallback: unknown[] | undefined): unknown[] | undefined {
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

  private async resolveSlug(title?: string | null, requested?: string | null, excludeId?: string): Promise<string | undefined> {
    const source = (requested ?? title ?? '').trim();
    if (!source) {
      return undefined;
    }

    const base = slugify(source, {lower: true});
    if (!base) {
      return undefined;
    }

    let candidate = base;
    let suffix = 1;
    const model = this.postRepository.getModel();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const where: Record<string, unknown> = {post_slug: candidate};
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

  private async findByIdOrThrow(id: string): Promise<Post> {
    const post = await this.postRepository.getModel().findByPk(id);
    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND');
    }
    return post;
  }

  async list(query: PostQueryDto): Promise<IPaginateResult<Post>> {
    const {page = 1, limit = 10, is_active, is_popular, status, search} = query;

    const where: {[key: string]: unknown; [key: symbol]: unknown} = {};

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (is_popular !== undefined) {
      where.is_popular = is_popular;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        {post_title: {[Op.iLike]: `%${search}%`}},
        {post_slug: {[Op.iLike]: `%${search}%`}},
        {post_description: {[Op.iLike]: `%${search}%`}},
      ];
    }

    const options: FindOptions = {
      where,
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC'],
      ],
    };

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = pageNumber > 1 ? (pageNumber - 1) * limitNumber : 0;

    const {count, rows} = await this.postRepository.getModel().findAndCountAll({
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
      rows: rows as Post[],
    };
  }

  async getById(id: string): Promise<Post> {
    return this.findByIdOrThrow(id);
  }

  async create(payload: CreatePostDto): Promise<Post> {
    const slug = await this.resolveSlug(payload.post_title, payload.post_slug ?? null);
    const gallery = this.normalizeGallery(payload.gallery, []);

    const data = this.sanitizePayload({
      ...payload,
      post_slug: slug ?? payload.post_slug ?? undefined,
      gallery,
      is_active: payload.is_active ?? true,
      is_popular: payload.is_popular ?? false,
      priority: payload.priority ?? 0,
    });

    const created = await this.postRepository.create(data as unknown as Post);
    return this.findByIdOrThrow(created.id);
  }

  async update(id: string, payload: UpdatePostDto): Promise<Post> {
    const current = await this.findByIdOrThrow(id);

    const slug = await this.resolveSlug(payload.post_title ?? current.post_title, payload.post_slug ?? null, id);
    const gallery = this.normalizeGallery(payload.gallery, undefined);

    const data = this.sanitizePayload({
      ...payload,
      post_slug: slug ?? payload.post_slug,
      gallery,
    });

    const [affected] = await this.postRepository.update(id, data as Partial<Post>);
    if (!affected) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'POST_NOT_UPDATED');
    }

    return this.findByIdOrThrow(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.postRepository.delete(id);
  }
}

export default PostService;
