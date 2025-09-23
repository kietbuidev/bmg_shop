/**
 * @openapi
 * components:
 *  schemas:
 *    Contact:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "f4c62dd3-88ab-4a1d-a487-0ab1562f2c30"
 *        full_name:
 *          type: string
 *          example: "Jane Doe"
 *        phone:
 *          type: string
 *          nullable: true
 *          example: "+84 123 456 789"
 *        address:
 *          type: string
 *          nullable: true
 *          example: "123 Fashion Street, District 1"
 *        email:
 *          type: string
 *          format: email
 *          nullable: true
 *          example: "jane@example.com"
 *        subject:
 *          type: string
 *          nullable: true
 *          example: "Order enquiry"
 *        message:
 *          type: string
 *          nullable: true
 *          example: "I would like to know more about product MD-001."
 *        attachment:
 *          type: string
 *          nullable: true
 *          example: "https://cdn.example.com/attachments/invoice.pdf"
 *        status:
 *          type: string
 *          nullable: true
 *          example: "new"
 *        note:
 *          type: string
 *          nullable: true
 *          example: "Customer called back, provided additional measurements."
 *        created_at:
 *          type: string
 *          format: date-time
 *          example: "2024-08-17T03:15:42.000Z"
 *        updated_at:
 *          type: string
 *          format: date-time
 *          example: "2024-08-17T03:45:10.000Z"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ContactCreateInput:
 *      type: object
 *      required:
 *        - full_name
 *        - subject
 *      properties:
 *        full_name:
 *          type: string
 *          example: "Jane Doe"
 *        phone:
 *          type: string
 *          nullable: true
 *          example: "+84 123 456 789"
 *        address:
 *          type: string
 *          nullable: true
 *          example: "123 Fashion Street, District 1"
 *        email:
 *          type: string
 *          format: email
 *          nullable: true
 *          example: "jane@example.com"
 *        subject:
 *          type: string
 *          example: "Order enquiry"
 *        message:
 *          type: string
 *          nullable: true
 *          example: "I would like to know more about product MD-001."
 *        attachment:
 *          type: string
 *          nullable: true
 *          example: "https://cdn.example.com/attachments/invoice.pdf"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ContactUpdateNoteInput:
 *      type: object
 *      required:
 *        - note
 *      properties:
 *        note:
 *          type: string
 *          example: "Customer called back, provided additional measurements."
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ContactListResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        rows:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Contact'
 *        pagination:
 *          type: object
 *          properties:
 *            total_page:
 *              type: integer
 *              example: 5
 *            per_page:
 *              type: integer
 *              example: 10
 *            current_page:
 *              type: integer
 *              example: 1
 *            count:
 *              type: integer
 *              example: 10
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ContactDetailResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        data:
 *          $ref: '#/components/schemas/Contact'
 */
