import {Router} from 'express';
import {UserRouter} from './userRoutes';
import {CategoryRouter} from './categoryRoutes';
import Container from 'typedi';

const router = Router();

const defaultRoutes = [
  {
    path: '/users',
    route: Container.get(UserRouter).getRouter(),
  },
  {
    path: '/categories',
    route: Container.get(CategoryRouter).getRouter(),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
