import {Router} from 'express';
import {CategoryRouter} from './categoryRoutes';
import {ProductRouter} from './productRoutes';
import {ContactRouter} from './contactRoutes';
import {OrderRouter} from './orderRoutes';
import {CounterRouter} from './counterRoutes';
import Container from 'typedi';

const router = Router();

const defaultRoutes = [
  {
    path: '/categories',
    route: Container.get(CategoryRouter).getRouter(),
  },
  {
    path: '/products',
    route: Container.get(ProductRouter).getRouter(),
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
    path: '/counter',
    route: Container.get(CounterRouter).getRouter(),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
