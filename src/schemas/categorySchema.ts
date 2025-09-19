/**
 * @openapi
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          example: 1
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
 *          type: number
 *          nullable: true
 *        thumbnail_id:
 *          type: number
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
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CategoryCreateInput:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Accessories
 *        slug:
 *          type: string
 *          example: accessories
 *        description:
 *          type: string
 *        parent_id:
 *          type: number
 *          nullable: true
 *        thumbnail_id:
 *          type: number
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
 *      properties:
 *        name:
 *          type: string
 *        slug:
 *          type: string
 *        description:
 *          type: string
 *        parent_id:
 *          type: number
 *          nullable: true
 *        thumbnail_id:
 *          type: number
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
