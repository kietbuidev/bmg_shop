import {MakeNullishOptional} from 'sequelize/types/utils';
import {IRequestQuery, IPaginateResult} from '../../utils/types';
import {Model, FindOptions, ModelStatic, WhereOptions, ManyToManyOptions} from 'sequelize';
export abstract class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  public async findByOptions(options?: FindOptions): Promise<T[]> {
    const result = await this.model.findAll(options);
    return result as T[];
  }

  public async findAndCountAll(options?: FindOptions, query?: IRequestQuery): Promise<{count: number; rows: T[]}> {
    const result = await this.model.findAndCountAll({
      ...options,
      offset: query?.page ?? 0,
      limit: query?.limit ?? 10,
    });
    return {
      count: result.count,
      rows: result.rows as T[],
    };
  }

  public async findAndPaginate(options: FindOptions = {}, query: IRequestQuery = {}): Promise<IPaginateResult<T>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = page > 1 ? (page - 1) * limit : 0;

    const paginate = {limit: limit, offset};
    // options.raw = true;

    const {count, rows} = await this.model.findAndCountAll({
      ...options,
      ...paginate,
    });

    const total_page = Math.ceil(count / limit || 1);

    return {
      pagination: {
        total_page: total_page,
        per_page: limit,
        current_page: page,
        count,
      },
      rows: rows as T[],
    };
  }

  // async getById<U>(
  //   idKeyName: string = 'id',
  //   idValue: U,
  //   options?: FindOptions,
  // ): Promise<T | null> {
  //   const whereClause = {
  //     [idKeyName]: idValue,
  //   } as WhereOptions<T>;

  //   return this.model.findOne({
  //     where: whereClause,
  //     ...(options ?? null),
  //   });
  // }

  async getById<U>(idValue: U, options?: FindOptions): Promise<T | null> {
    const whereClause = {
      id: idValue,
    } as WhereOptions<T>;

    return this.model.findOne({
      where: whereClause,
      ...(options ?? null),
    });
  }

  async getByKey<U>(keyName: string, keyValue: U, options?: FindOptions): Promise<T | null> {
    const whereClause = {
      [keyName]: keyValue,
    } as WhereOptions<T>;

    return this.model.findOne({
      where: whereClause,
      ...(options ?? null),
    });
  }

  async getByOne(options?: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  async countOptions(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }

  async create(data: MakeNullishOptional<T>): Promise<T> {
    // Update time
    // const now = new Date();
    // data['created_at'] = now;
    // data['updated_at'] = now;
    return this.model.create({
      ...data,
    });
  }

  async bulkCreate(data: any): Promise<any> {
    return this.model.bulkCreate(data, {returning: true});
  }

  async updateByKey<U>(idKeyName: string, idValue: U, data: Partial<T>): Promise<[affectedCount: number]> {
    const whereClause = {
      [idKeyName]: idValue,
    } as WhereOptions<T>;

    return this.model.unscoped().update(
      {
        ...data,
      },
      {
        where: whereClause,
      },
    );
  }

  async update<U>(idValue: U, data: Partial<T>): Promise<[affectedCount: number]> {
    // const now = new Date();
    // data['updated_at'] = now;
    const whereClause = {
      id: idValue,
    } as WhereOptions<T>;

    return this.model.unscoped().update(
      {
        ...data,
      },
      {
        where: whereClause,
      },
    );
  }

  async updateBulk<U>(data: Partial<T>, options?: FindOptions): Promise<[affectedCount: number]> {
    const whereClause = options as WhereOptions<T>;

    return this.model.unscoped().update(
      {
        ...data,
      },
      {
        where: whereClause,
      },
    );
  }

  // async delete<U>(idKeyName: string, idValue: U): Promise<number> {
  //   const whereClause = {
  //     [idKeyName]: idValue,
  //   } as WhereOptions<T>;

  //   return this.model.destroy({
  //     where: whereClause,
  //   });
  // }

  async delete<U>(idValue: U): Promise<number> {
    const whereClause = {
      id: idValue,
    } as WhereOptions<T>;

    return this.model.destroy({
      where: whereClause,
    });
  }

  async destroy<U>(options?: FindOptions, destroy: boolean = false): Promise<number> {
    const whereClause = options as WhereOptions<T>;

    return this.model.destroy({
      where: whereClause,
      force: destroy,
    });
  }

  getModel(): ModelStatic<T> {
    return this.model;
  }
}
