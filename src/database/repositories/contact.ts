import {BaseRepository} from './_base';
import Contact from '../models/contact';

export class ContactRepository extends BaseRepository<Contact> {
  constructor() {
    super(Contact);
  }
}

export default ContactRepository;
