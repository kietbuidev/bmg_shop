import type {Response, NextFunction} from 'express';
import {RequestCustom} from '../utils/types';
import {TokenUserPayload} from '../utils/types';
import {RoleType} from '../utils/enums';

export const isAdmin = async (req: RequestCustom, res: Response, next: NextFunction) => {
  // const userData: TokenUserPayload = req.user;
  // if (!userData) {
  //   return res.json({
  //     success: false,
  //     message: 'You must login',
  //   });
  // }
  // if (userData.role === RoleType.Admin) {
  //   next();
  // } else {
  //   res.json({
  //     success: false,
  //     message: 'Only Admin role can perform this action',
  //   });
  // }
};
