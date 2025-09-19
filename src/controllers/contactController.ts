import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import {validate as uuidValidate, version as uuidVersion} from 'uuid';
import BuildResponse from '../utils/buildResponse';
import ContactService from '../services/contactService';
import {CreateCustomerContactDto, ContactQueryDto, UpdateContactNoteDto} from '../database/models/dtos/contactDto';
import {CustomError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';

@Service()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as ContactQueryDto;
      const contacts = await this.contactService.list(query);
      res.status(200).json(BuildResponse.get(contacts));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateCustomerContactDto;
      const contact = await this.contactService.create(payload);
      res.status(201).json(
        BuildResponse.created({
          data: contact,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id);
      const payload = req.body as UpdateContactNoteDto;
      const contact = await this.contactService.updateNote(id, payload);
      res.status(200).json(
        BuildResponse.updated({
          data: contact,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  private parseId(idParam: string): string {
    const id = idParam?.trim();
    if (!id) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_CONTACT_ID');
    }

    if (!uuidValidate(id) || uuidVersion(id) !== 4) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_CONTACT_ID');
    }

    return id;
  }
}

export default ContactController;
