import {Service} from 'typedi';
import {Op, fn, col, WhereOptions} from 'sequelize';
import Counter from '../database/models/counter';
import CounterRepository from '../database/repositories/counter';
import {CreateCounterDto, GetCounterChartQueryDto} from '../database/models/dtos/counterDto';
import {CustomError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';

export interface CounterChartFilters {
  start_date: string | null;
  end_date: string | null;
}

export interface CounterChartDistributionEntry {
  value: string;
  total: number;
}

export interface CounterChartDailyEntry {
  date: string;
  total: number;
}

export interface CounterChartResponse {
  filters: CounterChartFilters;
  summary: {
    total_visits: number;
    unique_ips: number;
  };
  daily_visits: CounterChartDailyEntry[];
  os_distribution: CounterChartDistributionEntry[];
  browser_distribution: CounterChartDistributionEntry[];
  device_distribution: CounterChartDistributionEntry[];
}

type RawAggregationRow = {
  total?: number | string | null;
} & Record<string, unknown>;

type RawDailyRow = RawAggregationRow & {
  date?: string | Date | null;
};

@Service()
export class CounterService {
  private readonly counterRepository: CounterRepository;

  constructor() {
    this.counterRepository = new CounterRepository();
  }

  async create(payload: CreateCounterDto): Promise<Counter> {
    const counter = await this.counterRepository.create({
      ip: payload.ip ?? '0.0.0.0',
      os: payload.os ?? null,
      browser: payload.browser ?? null,
      device: payload.device ?? null,
    } as Counter);

    return this.counterRepository.getModel().findByPk(counter.id);
  }

  async getChartData(query: GetCounterChartQueryDto): Promise<CounterChartResponse> {
    const parsedStart = query.start_date ? new Date(query.start_date) : undefined;
    const parsedEnd = query.end_date ? new Date(query.end_date) : undefined;

    if (parsedStart && Number.isNaN(parsedStart.getTime())) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_START_DATE');
    }

    if (parsedEnd && Number.isNaN(parsedEnd.getTime())) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_END_DATE');
    }

    if (parsedStart && parsedEnd && parsedStart > parsedEnd) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_DATE_RANGE');
    }

    const startDate = parsedStart ? new Date(parsedStart.setHours(0, 0, 0, 0)) : undefined;
    const endDate = parsedEnd ? new Date(parsedEnd.setHours(23, 59, 59, 999)) : undefined;

    const whereClause: WhereOptions<Counter> = {};
    if (startDate || endDate) {
      const createdAtFilter: Record<string | symbol, Date> = {} as Record<string | symbol, Date>;
      if (startDate) {
        (createdAtFilter as any)[Op.gte] = startDate;
      }
      if (endDate) {
        (createdAtFilter as any)[Op.lte] = endDate;
      }
      (whereClause as any).created_at = createdAtFilter;
    }

    const model = this.counterRepository.getModel();

    const [totalVisits, uniqueIps] = await Promise.all([
      model.count({where: {...(whereClause as object)}}),
      model.count({
        where: {
          ...(whereClause as object),
          ip: {[Op.ne]: null},
        } as WhereOptions<Counter>,
        distinct: true,
        col: 'ip',
      }),
    ]);

    const dailyDateFn = fn('DATE', col('created_at'));

    const [dailyRowsRaw, osRowsRaw, browserRowsRaw, deviceRowsRaw] = await Promise.all([
      model.findAll({
        attributes: [
          [dailyDateFn, 'date'],
          [fn('COUNT', col('*')), 'total'],
        ],
        where: {...(whereClause as object)},
        group: [dailyDateFn],
        raw: true,
      }),
      model.findAll({
        attributes: [
          ['os', 'os'],
          [fn('COUNT', col('*')), 'total'],
        ],
        where: {...(whereClause as object)},
        group: ['os'],
        raw: true,
      }),
      model.findAll({
        attributes: [
          ['browser', 'browser'],
          [fn('COUNT', col('*')), 'total'],
        ],
        where: {...(whereClause as object)},
        group: ['browser'],
        raw: true,
      }),
      model.findAll({
        attributes: [
          ['device', 'device'],
          [fn('COUNT', col('*')), 'total'],
        ],
        where: {...(whereClause as object)},
        group: ['device'],
        raw: true,
      }),
    ]);

    const normalizeDate = (value: unknown) => {
      if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
      }

      if (typeof value === 'string') {
        return value.slice(0, 10);
      }

      return undefined;
    };

    const dailyRows = dailyRowsRaw as unknown as RawDailyRow[];
    const osRows = osRowsRaw as unknown as RawAggregationRow[];
    const browserRows = browserRowsRaw as unknown as RawAggregationRow[];
    const deviceRows = deviceRowsRaw as unknown as RawAggregationRow[];

    const mapDistribution = (rows: RawAggregationRow[], key: string): CounterChartDistributionEntry[] => {
      return rows
        .map((row) => {
          const rawValue = typeof row[key] === 'string' ? (row[key] as string).trim() : '';
          return {
            value: rawValue.length > 0 ? rawValue : 'UNKNOWN',
            total: Number(row.total ?? 0),
          };
        })
        .sort((a, b) => b.total - a.total);
    };

    const dailyVisits: CounterChartDailyEntry[] = dailyRows
      .map((row) => ({
        date: normalizeDate(row.date),
        total: Number(row.total ?? 0),
      }))
      .filter((entry): entry is {date: string | undefined; total: number} => Boolean(entry.date))
      .map((entry) => ({date: entry.date as string, total: entry.total}))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      filters: {
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null,
      },
      summary: {
        total_visits: totalVisits,
        unique_ips: uniqueIps,
      },
      daily_visits: dailyVisits,
      os_distribution: mapDistribution(osRows, 'os'),
      browser_distribution: mapDistribution(browserRows, 'browser'),
      device_distribution: mapDistribution(deviceRows, 'device'),
    };
  }
}

export default CounterService;
