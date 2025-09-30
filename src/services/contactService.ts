import {Service} from 'typedi';
import {FindOptions} from 'sequelize';
import ContactRepository from '../database/repositories/contact';
import Contact from '../database/models/contact';
import {
  CreateCustomerContactDto,
  ContactQueryDto,
  UpdateContactDto,
  UpdateContactNoteDto,
} from '../database/models/dtos/contactDto';
import {IPaginateResult} from '../utils/types';
import {NotFoundError} from '../utils/customError';
import { ContactStatus } from '../utils/enums';

@Service()
export class ContactService {
  private readonly contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  private async findByIdOrThrow(id: string): Promise<Contact> {
    const contact = await this.contactRepository.getModel().findByPk(id);
    if (!contact) {
      throw new NotFoundError('CONTACT_NOT_FOUND');
    }
    return contact;
  }

  async create(payload: CreateCustomerContactDto): Promise<Contact> {
    payload.status = payload.status ?? ContactStatus.NEW;
    const contact = await this.contactRepository.create(payload as unknown as Contact);
    return this.findByIdOrThrow(contact.id);
  }

  async list(query: ContactQueryDto): Promise<IPaginateResult<Contact>> {
    const {page = 1, limit = 10} = query;

    const options: FindOptions = {
      order: [['created_at', 'DESC']],
    };

    return this.contactRepository.findAndPaginate(options, {page, limit});
  }

  async updateNote(id: string, payload: UpdateContactNoteDto): Promise<Contact> {
    await this.findByIdOrThrow(id);

    const note = payload.note ?? null;
    await this.contactRepository.update(id, {note} as Partial<Contact>);

    return this.findByIdOrThrow(id);
  }

  async update(id: string, payload: UpdateContactDto): Promise<Contact> {
    await this.findByIdOrThrow(id);

    const data: Partial<Contact> = {};

    if (payload.note !== undefined) {
      data.note = payload.note ?? null;
    }

    if (payload.status !== undefined) {
      data.status = payload.status;
    }

    if (Object.keys(data).length === 0) {
      return this.findByIdOrThrow(id);
    }

    await this.contactRepository.update(id, data as Partial<Contact>);

    return this.findByIdOrThrow(id);
  }
}

export default ContactService;
