import {BaseRepository} from './_base';
import District from '../models/district';

export class DistrictRepository extends BaseRepository<District> {
  constructor() {
    super(District);
  }
}

export default DistrictRepository;
