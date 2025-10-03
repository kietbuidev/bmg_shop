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
