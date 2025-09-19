import {BaseRepository} from './_base';
import Category from '../models/category';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(Category);
  }
}

export default CategoryRepository;
