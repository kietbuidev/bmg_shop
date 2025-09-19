import {BaseRepository} from './_base';
import Counter from '../models/counter';

export class CounterRepository extends BaseRepository<Counter> {
  constructor() {
    super(Counter);
  }
}

export default CounterRepository;
