import {Request} from 'express';
import User from '../database/models/user';
import {FindOptions} from 'sequelize';

export interface RequestCustom extends Request {
  user: User;
  // config?: Object;
  language: string;
  currency: string;
  country: string;
  country_id: number;
}

export interface CustomFindOptions extends FindOptions {
  // language?: string;
  translation?: {
    language: string;
    fields: string[];
  } | null;
  currency?: string;
}

export interface IConfig {
  tenant: string; // HYT | FMT
  language: string;
  currency: string;
  country: string;
  platform: string;
  user_id?: string;
  x_api_key?: string;
}

export interface TokenUserPayload {
  id: string;
  // role: RoleType;
}

export interface TokenData {
  id: string;
  // role: RoleType;
  iat: string;
  exp: string;
}

export interface IRequestQuery {
  page?: number;
  limit?: number;
}

export interface IPaginateResult<T> {
  rows: T[];
  pagination: {
    total_page: number;
    per_page: number;
    current_page: number;
    count: number;

    // For reload result
    reload?: boolean;

    // For reload filter count
    reload_filter_count?: boolean;
  };
  summay_status?: object;
}

export interface IUserAddress {
  detail: string;
  district: string;
  province: string;
  district_id?: string | null;
  province_id?: string | null;
}
