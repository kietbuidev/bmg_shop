import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import CounterService, {type CounterChartResponse} from '../services/counterService';
import {CreateCounterDto, GetCounterChartQueryDto} from '../database/models/dtos/counterDto';

@Service()
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateCounterDto;
      const ipFromRequest = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.ip || undefined;

      const counter = await this.counterService.create({
        ...payload,
        ip: payload.ip ?? ipFromRequest,
      });

      res.status(201).json(
        BuildResponse.created({
          data: counter,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async chart(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = ((req as any).validated ?? req.query) as GetCounterChartQueryDto;
      const chart: CounterChartResponse = await this.counterService.getChartData(payload);

      res.status(200).json(
        BuildResponse.get({
          data: chart,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default CounterController;
