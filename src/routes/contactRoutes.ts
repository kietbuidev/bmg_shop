import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import ContactController from '../controllers/contactController';
import {validateDto} from '../middleware/validateDto';
import {ContactQueryDto, CreateCustomerContactDto, UpdateContactNoteDto} from '../database/models/dtos/contactDto';

@Service()
export class ContactRouter {
  private readonly router: Router;

  constructor(private readonly contactController: ContactController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/',
      validateDto(ContactQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.contactController.list(req, res, next);
      },
    );

    this.router.post(
      '/',
      validateDto(CreateCustomerContactDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.contactController.create(req, res, next);
      },
    );

    this.router.patch(
      '/:id/note',
      validateDto(UpdateContactNoteDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.contactController.updateNote(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default ContactRouter;

/**
 * @openapi
 * '/api/contacts':
 *  get:
 *     tags:
 *     - Contacts
 *     summary: List contacts
 *     description: Retrieve customer contacts with pagination
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          example: 1
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          example: 10
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ContactListResponse'
 */

/**
 * @openapi
 * '/api/contacts':
 *  post:
 *     tags:
 *     - Contacts
 *     summary: Create contact
 *     description: Submit a new customer contact request
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ContactCreateInput'
 *          example:
 *            full_name: "Jane Doe"
 *            phone: "+84 123 456 789"
 *            address: "123 Fashion Street"
 *            email: "jane@example.com"
 *            subject: "Order enquiry"
 *            message: "I would like to know more about product MD-001"
 *            attachment: "https://cdn.example.com/attachments/invoice.pdf"
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ContactDetailResponse'
 *      400:
 *        description: Validation error
 */

/**
 * @openapi
 * '/api/contacts/{id}/note':
 *  patch:
 *     tags:
 *     - Contacts
 *     summary: Update contact note
 *     description: Update internal note for a specific contact
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ContactUpdateNoteInput'
 *          example:
 *            note: "Customer called back, provided additional measurements."
 *     responses:
 *      200:
 *        description: Updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ContactDetailResponse'
 *      404:
 *        description: Contact not found
 */
