/**
 * @openapi
 * components:
 *  schemas:
 *    OrderCustomer:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "2f7f9aa1-81fb-4c1a-8ff5-4c9037cdcd26"
 *        full_name:
 *          type: string
 *          example: "Jane Doe"
 *        email:
 *          type: string
 *          format: email
 *          nullable: true
 *          example: "jane@example.com"
 *        phone:
 *          type: string
 *          nullable: true
 *          example: "+84 123 456 789"
 *        address:
 *          type: string
 *          nullable: true
 *          example: "123 Fashion Street"
 *        note:
 *          type: string
 *          nullable: true
 *          example: "Deliver after 6 PM"
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
 *    OrderItem:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "123e4567-e89b-12d3-a456-426614174000"
 *        order_id:
 *          type: string
 *          format: uuid
 *        product_id:
 *          type: string
 *          format: uuid
 *        product_code:
 *          type: string
 *          example: "MD-001"
 *        product_name:
 *          type: string
 *          example: "Minimal Dress"
 *        product_thumbnail:
 *          type: string
 *          nullable: true
 *          example: "https://cdn.example.com/products/minimal-dress.jpg"
 *        selected_size:
 *          type: string
 *          nullable: true
 *          example: "M"
 *        selected_color:
 *          type: string
 *          nullable: true
 *          example: "red"
 *        unit_currency:
 *          type: string
 *          example: "VND"
 *        unit_price:
 *          type: string
 *          example: "299000.00"
 *        unit_discount_value:
 *          type: string
 *          example: "50000.00"
 *        unit_discounted_price:
 *          type: string
 *          example: "249000.00"
 *        quantity:
 *          type: integer
 *          example: 2
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
 *    Order:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: "4c35d1a4-cd07-4fd5-9ba9-3c4c5a952771"
 *        order_code:
 *          type: string
 *          example: "OD2A9F8B7C6D5E4F3A2B1"
 *        customer_id:
 *          type: string
 *          format: uuid
 *        status:
 *          type: string
 *          example: "PENDING"
 *        currency:
 *          type: string
 *          example: "VND"
 *        total_items:
 *          type: integer
 *          example: 3
 *        subtotal_amount:
 *          type: string
 *          example: "598000.00"
 *        discount_amount:
 *          type: string
 *          example: "100000.00"
 *        total_amount:
 *          type: string
 *          example: "498000.00"
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        customer:
 *          $ref: '#/components/schemas/OrderCustomer'
 *        items:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/OrderItem'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    OrderCreateInput:
 *      type: object
 *      required:
 *        - customer
 *        - items
 *      properties:
 *        customer:
 *          type: object
 *          required:
 *            - full_name
 *          properties:
 *            full_name:
 *              type: string
 *              example: "Jane Doe"
 *            email:
 *              type: string
 *              nullable: true
 *              format: email
 *            phone:
 *              type: string
 *              nullable: true
 *            address:
 *              type: string
 *              nullable: true
 *            note:
 *              type: string
 *              nullable: true
 *              example: "Deliver after 6 PM"
 *        items:
 *          type: array
 *          minItems: 1
 *          items:
 *            type: object
 *            required:
 *              - product_id
 *            properties:
 *              product_id:
 *                type: string
 *                format: uuid
 *              quantity:
 *                type: integer
 *                minimum: 1
 *                example: 2
 *              selected_size:
 *                type: string
 *                nullable: true
 *                example: "M"
 *              selected_color:
 *                type: string
 *                nullable: true
 *                example: "red"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    OrderDetailResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 201
 *        message:
 *          type: string
 *          example: "data has been added!"
 *        data:
 *          $ref: '#/components/schemas/Order'
 */
