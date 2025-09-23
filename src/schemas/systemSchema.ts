/**
 * @openapi
 * components:
 *  schemas:
 *    Counter:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "5e5a5f3b-2d63-47f1-9b43-8d7bdfc4c1f0"
 *        ip:
 *          type: string
 *          example: "203.0.113.42"
 *        os:
 *          type: string
 *          nullable: true
 *          example: "iOS 17"
 *        browser:
 *          type: string
 *          nullable: true
 *          example: "Safari"
 *        device:
 *          type: string
 *          nullable: true
 *          example: "iPhone 15"
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CounterCreateInput:
 *      type: object
 *      properties:
 *        ip:
 *          type: string
 *          format: ipv4
 *          example: "203.0.113.42"
 *        os:
 *          type: string
 *          nullable: true
 *        browser:
 *          type: string
 *          nullable: true
 *        device:
 *          type: string
 *          nullable: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CounterDetailResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 201
 *        message:
 *          type: string
 *          example: "data has been added!"
 *        data:
 *          $ref: '#/components/schemas/Counter'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UploadImageResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 201
 *        message:
 *          type: string
 *          example: "data has been added!"
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              example: "1ZdR3sJpLkMn"
 *            name:
 *              type: string
 *              example: "image-172387234.png"
 *            mimeType:
 *              type: string
 *              example: "image/png"
 *            size:
 *              type: integer
 *              example: 58234
 *            webViewLink:
 *              type: string
 *              format: uri
 *              example: "https://drive.google.com/file/d/1ZdR3sJpLkMn/view"
 *            downloadLink:
 *              type: string
 *              format: uri
 *              example: "https://drive.google.com/uc?id=1ZdR3sJpLkMn&export=download"
 */
