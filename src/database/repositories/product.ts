import {BaseRepository} from './_base';
import Product from '../models/product';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }
}

export default ProductRepository;
