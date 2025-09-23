/**
 * @openapi
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "8b7f3b62-4f54-4f0f-9f51-49fc9ec5ae5c"
 *        name:
 *          type: string
 *          example: Women Fashion
 *        slug:
 *          type: string
 *          example: women-fashion
 *        description:
 *          type: string
 *          nullable: true
 *        parent_id:
 *          type: string
 *          format: uuid
 *          nullable: true
 *          example: "b1f0de49-8f5f-4e8c-b6bb-32b10b0aa70c"
 *        thumbnail:
 *          type: string
 *          nullable: true
 *        gallery:
 *          type: array
 *          items:
 *            type: string
 *        is_active:
 *          type: boolean
 *          example: true
 *        is_popular:
 *          type: boolean
 *          example: false
 *        priority:
 *          type: integer
 *          example: 0
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
 *        updated_at:
 *          type: string
 *          format: date-time
 *        deleted_at:
 *          type: string
 *          format: date-time
 *          nullable: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryCreateInput:
 *      type: object
 *      required:
 *        - name
 *      description: Slug is generated automatically from the category name.
 *      properties:
 *        name:
 *          type: string
 *          example: Accessories
 *        description:
 *          type: string
 *        parent_id:
 *          type: string
 *          format: uuid
 *          nullable: true
 *          example: "1d1e7cfd-3c41-4c47-8f4d-f6f5beb3fd93"
 *        thumbnail:
 *          type: string
 *          nullable: true
 *        gallery:
 *          type: array
 *          items:
 *            type: string
 *        is_active:
 *          type: boolean
 *          example: true
 *        is_popular:
 *          type: boolean
 *          example: false
 *        priority:
 *          type: integer
 *          example: 0
 *        meta_title:
 *          type: string
 *        meta_keyword:
 *          type: string
 *        meta_description:
 *          type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryUpdateInput:
 *      type: object
 *      description: Slug is generated automatically from the category name.
 *      properties:
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        parent_id:
 *          type: string
 *          format: uuid
 *          nullable: true
 *        thumbnail:
 *          type: string
 *          nullable: true
 *        gallery:
 *          type: array
 *          items:
 *            type: string
 *        is_active:
 *          type: boolean
 *        is_popular:
 *          type: boolean
 *        priority:
 *          type: integer
 *        meta_title:
 *          type: string
 *        meta_keyword:
 *          type: string
 *        meta_description:
 *          type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryListResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: data has been received!
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
 *            $ref: '#/components/schemas/Category'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryDetailResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: data has been received!
 *        data:
 *          $ref: '#/components/schemas/Category'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryDeleteResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: data has been deleted!
 */
