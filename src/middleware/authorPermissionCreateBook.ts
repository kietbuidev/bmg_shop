// import type {Response, NextFunction} from 'express';
// import {RequestCustom} from '../utils/types';
// import {TokenUserPayload} from '../utils/types';
// import {RoleType} from '../utils/enums';

// export const authorPermissionCreateBook = async (
//   req: RequestCustom,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const userData: TokenUserPayload = req.user;

//   if (!userData) {
//     return res.json({
//       success: false,
//       message: 'You must login',
//     });
//   }

//   if (userData.role === RoleType.Author) {
//     if (userData.uuid === req.body.userUid) {
//       next();
//     } else {
//       return res.json({
//         success: false,
//         message: 'Author can add only own books',
//       });
//     }
//   } else {
//     next();
//   }
// };
