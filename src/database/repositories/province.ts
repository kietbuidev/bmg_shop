import {BaseRepository} from './_base';
import Province from '../models/province';

export class ProvinceRepository extends BaseRepository<Province> {
  constructor() {
    super(Province);
  }
}

export default ProvinceRepository;
