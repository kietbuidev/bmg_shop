import {Router} from 'express';
import {CategoryRouter} from './categoryRoutes';
import {ProductRouter} from './productRoutes';
import {PostRouter} from './postRoutes';
import {ContactRouter} from './contactRoutes';
import {OrderRouter} from './orderRoutes';
import {SystemRouter} from './systemRoutes';
import {UserRouter} from './userRoutes';
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
  {
    path: '/products',
    route: Container.get(ProductRouter).getRouter(),
  },
  {
    path: '/posts',
    route: Container.get(PostRouter).getRouter(),
  },
  {
    path: '/contacts',
    route: Container.get(ContactRouter).getRouter(),
  },
  {
    path: '/orders',
    route: Container.get(OrderRouter).getRouter(),
  },
  {
    path: '/system',
    route: Container.get(SystemRouter).getRouter(),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
