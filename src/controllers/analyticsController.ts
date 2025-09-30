import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import AnalyticsService from '../services/analyticsService';

@Service()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  async getOrderAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.analyticsService.getOrderAnalytics();
      res.status(200).json(
        BuildResponse.get({
          data,
        }),
      );
    } catch (error) {
            console.log(error);

      next(error);
    }
  }

  async getProductAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.analyticsService.getProductAnalytics();
      res.status(200).json(
        BuildResponse.get({
          data,
        }),
      );
    } catch (error) {
            console.log(error);

      next(error);
    }
  }

  async getPostAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.analyticsService.getPostAnalytics();
      res.status(200).json(
        BuildResponse.get({
          data,
        }),
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getContactAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.analyticsService.getContactAnalytics();
      res.status(200).json(
        BuildResponse.get({
          data,
        }),
      );
    } catch (error) {
            console.log(error);

      next(error);
    }
  }
}

export default AnalyticsController;
