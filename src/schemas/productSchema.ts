/**
 * @openapi
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "0f9e8d7c-6b5a-4e3d-2c1b-a09876543210"
 *        category_id:
 *          type: string
 *          format: uuid
 *          example: "1a2b3c4d-5e6f-7a8b-9c0d-ef1234567890"
 *        name:
 *          type: string
 *          example: "Minimal Dress"
 *        code:
 *          type: string
 *          example: "MD-001"
 *        slug:
 *          type: string
 *          description: URL-friendly identifier automatically generated from the product name.
 *          example: "minimal-dress"
 *        description:
 *          type: string
 *          nullable: true
 *        short_description:
 *          type: string
 *          nullable: true
 *        content:
 *          type: string
 *          nullable: true
 *        material:
 *          type: array
 *          items:
 *            type: string
 *          example:
 *            - "Cotton"
 *            - "Linen"
 *        style:
 *          type: string
 *          nullable: true
 *          example: "Casual"
 *        status:
 *          type: string
 *          nullable: true
 *          enum:
 *            - NEW
 *            - BEST_SELLER
 *            - SALE_OFF
 *            - NORMAL
 *          example: "NEW"
 *        thumbnail:
 *          type: string
 *          nullable: true
 *          example: "https://cdn.example.com/products/minimal-dress.jpg"
 *        gallery:
 *          type: array
 *          items:
 *            type: string
 *          example:
 *            - "https://cdn.example.com/products/gallery-1.jpg"
 *            - "https://cdn.example.com/products/gallery-2.jpg"
 *        colors:
 *          type: array
 *          items:
 *            type: string
 *          example:
 *            - "red"
 *            - "black"
 *        sizes:
 *          type: array
 *          items:
 *            type: string
 *          example:
 *            - "S"
 *            - "M"
 *            - "L"
 *        regular_price:
 *          type: number
 *          example: 299000.0
 *        sale_price:
 *          type: number
 *          example: 249000.0
 *        percent:
 *          type: number
 *          example: 20.0
 *        currency:
 *          type: string
 *          example: "VND"
 *        view_count:
 *          type: integer
 *          example: 123
 *        is_active:
 *          type: boolean
 *          example: true
 *        is_popular:
 *          type: boolean
 *          example: false
 *        priority:
 *          type: integer
 *          example: 5
 *        meta_title:
 *          type: string
 *          nullable: true
 *        meta_keyword:
 *          type: string
 *          nullable: true
 *        meta_description:
 *          type: string
 *          nullable: true
 *        created_at:
 *          type: string
 *          format: date-time
 *          example: "2024-08-17T03:15:42.000Z"
 *        updated_at:
 *          type: string
 *          format: date-time
 *          example: "2024-08-17T05:01:10.000Z"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProductCreateInput:
 *      type: object
 *      required:
 *        - category_id
 *        - name
 *        - code
 *      properties:
 *        category_id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *          example: "Minimal Dress"
 *        code:
 *          type: string
 *          example: "MD-001"
 *        description:
 *          type: string
 *          nullable: true
 *        short_description:
 *          type: string
 *          nullable: true
 *        content:
 *          type: string
 *          nullable: true
 *        material:
 *          type: array
 *          items:
 *            type: string
 *        style:
 *          type: string
 *          nullable: true
 *        status:
 *          type: string
 *          nullable: true
 *          enum:
 *            - NEW
 *            - BEST_SELLER
 *            - SALE_OFF
 *            - NORMAL
 *          example: "NEW"
 *        thumbnail:
 *          type: string
 *          nullable: true
 *        gallery:
 *          type: array
 *          items:
 *            type: string
 *        colors:
 *          type: array
 *          items:
 *            type: string
 *        sizes:
 *          type: array
 *          items:
 *            type: string
 *        regular_price:
 *          type: number
 *          example: 299000
 *        sale_price:
 *          type: number
 *          example: 249000
 *        percent:
 *          type: number
 *          example: 20
 *        currency:
 *          type: string
 *          example: "VND"
 *        is_active:
 *          type: boolean
 *          example: true
 *        is_popular:
 *          type: boolean
 *          example: false
 *        priority:
 *          type: integer
 *          example: 5
 *        meta_title:
 *          type: string
 *          nullable: true
 *        meta_keyword:
 *          type: string
 *          nullable: true
 *        meta_description:
 *          type: string
 *          nullable: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProductUpdateInput:
 *      type: object
 *      properties:
 *        category_id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *        code:
 *          type: string
 *        description:
 *          type: string
 *          nullable: true
 *        short_description:
 *          type: string
 *          nullable: true
 *        content:
 *          type: string
 *          nullable: true
 *        material:
 *          type: array
 *          items:
 *            type: string
 *        style:
 *          type: string
 *          nullable: true
 *        status:
 *          type: string
 *          nullable: true
 *          enum:
 *            - NEW
 *            - BEST_SELLER
 *            - SALE_OFF
 *            - NORMAL
 *        thumbnail:
 *          type: string
 *          nullable: true
 *        gallery:
 *          type: array
 *          items:
 *            type: string
 *        colors:
 *          type: array
 *          items:
 *            type: string
 *        sizes:
 *          type: array
 *          items:
 *            type: string
 *        regular_price:
 *          type: number
 *        sale_price:
 *          type: number
 *        percent:
 *          type: number
 *        currency:
 *          type: string
 *        is_active:
 *          type: boolean
 *        is_popular:
 *          type: boolean
 *        priority:
 *          type: integer
 *        meta_title:
 *          type: string
 *          nullable: true
 *        meta_keyword:
 *          type: string
 *          nullable: true
 *        meta_description:
 *          type: string
 *          nullable: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProductListResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        pagination:
 *          type: object
 *          properties:
 *            total_page:
 *              type: integer
 *            per_page:
 *              type: integer
 *            current_page:
 *              type: integer
 *            count:
 *              type: integer
 *        rows:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Product'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProductListByCategoryResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        pagination:
 *          type: object
 *          properties:
 *            total_page:
 *              type: integer
 *            per_page:
 *              type: integer
 *            current_page:
 *              type: integer
 *            count:
 *              type: integer
 *        rows:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Product'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProductDetailResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        data:
 *          $ref: '#/components/schemas/Product'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProductDeleteResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been deleted!"
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 */
