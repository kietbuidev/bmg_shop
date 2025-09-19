import {BaseRepository} from './_base';
import Customer from '../models/customer';

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super(Customer);
  }
}

export default CustomerRepository;
