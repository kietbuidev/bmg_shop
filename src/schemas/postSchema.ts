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
 *          description: URL-friendly identifier automatically generated from the post title.
 *          example: summer-fashion-trends
 *        post_description:
 *          type: string
 *          nullable: true
 *        post_content:
 *          type: string
 *          nullable: true
 *          example: "<p>Highlights from the latest runway shows with styling tips.</p>"
 *        post_tag:
 *          type: string
 *          nullable: true
 *          example: "fashion,summer,style"
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
 *        status:
 *          type: string
 *          nullable: true
 *        meta_title:
 *          type: string
 *          nullable: true
 *          example: "Summer Fashion Trends | BMG"
 *        meta_keyword:
 *          type: string
 *          nullable: true
 *          example: "fashion,summer,style"
 *        meta_description:
 *          type: string
 *          nullable: true
 *          example: "Top summer fashion trends for this season."
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
 *        post_description:
 *          type: string
 *        post_content:
 *          type: string
 *          example: "<p>Highlights from the latest runway shows with styling tips.</p>"
 *        post_tag:
 *          type: string
 *          example: "fashion,summer,style"
 *        thumbnail:
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
 *    PostUpdateInput:
 *      type: object
 *      properties:
 *        post_title:
 *          type: string
 *        post_description:
 *          type: string
 *        post_content:
 *          type: string
 *          example: "<p>Updated summer trends content.</p>"
 *        post_tag:
 *          type: string
 *          example: "summer,trends"
 *        thumbnail:
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
