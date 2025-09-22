/**
 * @openapi
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "8d1e2cbf-5ce5-4b01-96b2-9f6a7a1bc7de"
 *        post_title:
 *          type: string
 *          example: Summer Fashion Trends
 *        post_slug:
 *          type: string
 *          example: summer-fashion-trends
 *        post_description:
 *          type: string
 *          nullable: true
 *        post_content:
 *          type: string
 *          nullable: true
 *        post_tag:
 *          type: string
 *          nullable: true
 *        thumbnail_id:
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
 *        status:
 *          type: string
 *          nullable: true
 *        author:
 *          type: integer
 *          example: 0
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
 *    PostCreateInput:
 *      type: object
 *      required:
 *        - post_title
 *      properties:
 *        post_title:
 *          type: string
 *          example: Summer Fashion Trends
 *        post_slug:
 *          type: string
 *          example: summer-fashion-trends
 *        post_description:
 *          type: string
 *        post_content:
 *          type: string
 *        post_tag:
 *          type: string
 *        thumbnail_id:
 *          type: string
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
 *        status:
 *          type: string
 *        author:
 *          type: integer
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    PostUpdateInput:
 *      type: object
 *      properties:
 *        post_title:
 *          type: string
 *        post_slug:
 *          type: string
 *        post_description:
 *          type: string
 *        post_content:
 *          type: string
 *        post_tag:
 *          type: string
 *        thumbnail_id:
 *          type: string
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
 *        status:
 *          type: string
 *        author:
 *          type: integer
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    PostListResponse:
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
 *            $ref: '#/components/schemas/Post'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    PostDetailResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: data has been received!
 *        data:
 *          $ref: '#/components/schemas/Post'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    PostDeleteResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: data has been deleted!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 */
