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
 *    CounterChartDailyEntry:
 *      type: object
 *      properties:
 *        date:
 *          type: string
 *          format: date
 *          example: "2024-02-18"
 *        total:
 *          type: integer
 *          example: 124
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CounterChartDistributionEntry:
 *      type: object
 *      properties:
 *        value:
 *          type: string
 *          example: "iOS"
 *        total:
 *          type: integer
 *          example: 87
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CounterChartSummary:
 *      type: object
 *      properties:
 *        total_visits:
 *          type: integer
 *          example: 430
 *        unique_ips:
 *          type: integer
 *          example: 295
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CounterChartResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: integer
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been retrieved!"
 *        data:
 *          type: object
 *          properties:
 *            filters:
 *              type: object
 *              properties:
 *                start_date:
 *                  type: string
 *                  nullable: true
 *                  example: "2024-02-01T00:00:00.000Z"
 *                end_date:
 *                  type: string
 *                  nullable: true
 *                  example: "2024-02-18T23:59:59.999Z"
 *            summary:
 *              $ref: '#/components/schemas/CounterChartSummary'
 *            daily_visits:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CounterChartDailyEntry'
 *            os_distribution:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CounterChartDistributionEntry'
 *            browser_distribution:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CounterChartDistributionEntry'
 *            device_distribution:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CounterChartDistributionEntry'
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
 *              example: "bmg_shop/posts/image-172387234"
 *            assetId:
 *              type: string
 *              example: "e64adf1a3de9d0c7b1234567890abcde"
 *            name:
 *              type: string
 *              example: "bmg_shop/posts/image-172387234"
 *            originalFilename:
 *              type: string
 *              example: "feature-banner.png"
 *            folder:
 *              type: string
 *              example: "bmg_shop/posts"
 *            format:
 *              type: string
 *              example: "png"
 *            resourceType:
 *              type: string
 *              example: "image"
 *            mimeType:
 *              type: string
 *              example: "image/png"
 *            size:
 *              type: integer
 *              example: 58234
 *            width:
 *              type: integer
 *              example: 1280
 *            height:
 *              type: integer
 *              example: 720
 *            url:
 *              type: string
 *              format: uri
 *              example: "http://res.cloudinary.com/dbms5fhqs/image/upload/v1723872345/bmg_shop/posts/image-172387234.png"
 *            secureUrl:
 *              type: string
 *              format: uri
 *              example: "https://res.cloudinary.com/dbms5fhqs/image/upload/v1723872345/bmg_shop/posts/image-172387234.png"
 *            webViewLink:
 *              type: string
 *              format: uri
 *              example: "https://res.cloudinary.com/dbms5fhqs/image/upload/v1723872345/bmg_shop/posts/image-172387234.png"
 *            downloadLink:
 *              type: string
 *              format: uri
 *              example: "https://res.cloudinary.com/dbms5fhqs/image/upload/v1723872345/bmg_shop/posts/image-172387234.png"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    Province:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "9d6f8e55-3c21-43b7-9f3a-5c36a8d4fd13"
 *        name:
 *          type: string
 *          example: "Hồ Chí Minh"
 *    ProvinceListResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: integer
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Province'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    District:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "23d7b560-9b6a-4c14-a14d-0c9e4bf322c5"
 *        province_id:
 *          type: string
 *          format: uuid
 *          example: "9d6f8e55-3c21-43b7-9f3a-5c36a8d4fd13"
 *        name:
 *          type: string
 *          example: "Quận 1"
 *    DistrictListResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: integer
 *          example: 200
 *        message:
 *          type: string
 *          example: "data has been received!"
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/District'
 */
