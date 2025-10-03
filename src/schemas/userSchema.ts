/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterInput:
 *      type: object
 *      required:
 *        - first_name
 *        - last_name
 *        - phone_code
 *        - phone
 *        - email
 *        - password
 *      properties:
 *        first_name:
 *          type: string
 *          default: Example
 *        last_name:
 *          type: string
 *          default: Account
 *        phone_code:
 *          type: string
 *          default: +84
 *        phone:
 *          type: string
 *          default: 1234567890
 *        country:
 *          type: string
 *          default: vn
 *        email:
 *          type: string
 *          default: example@gmail.com
 *        password:
 *          type: string
 *          default: Admin123@
 *        confirm_password:
 *          type: string
 *          default: Admin123@
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    VerifyInput:
 *      type: object
 *      required:
 *        - email
 *        - code_verify
 *        - device_token
 *      properties:
 *        email:
 *          type: string
 *          default: example@gmail.com
 *        code_verify:
 *          type: string
 *          default: 123456
 *        device_token:
 *          type: string
 *          default: 1
 *        reset_password:
 *          type: boolean
 *          default: false
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    VerifyOutput:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Verify code successfully!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            full_name:
 *              type: string
 *            email:
 *              type: string
 *            code_reset_password:
 *              type: string
 *            reset_password:
 *              type: boolean
 *            token:
 *              type: string
 *            refresh_token:
 *              type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ProfileResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Get detail user successfully!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            email:
 *              type: string
 *            email_verified_at:
 *              type: string
 *            phone:
 *              type: string
 *            address:
 *              type: string
 *            description:
 *              type: string
 *            request_date:
 *              type: string
 *            provider:
 *              type: string
 *            provider_id:
 *              type: string
 *            payout:
 *              type: string
 *            last_check_notification:
 *              type: string
 *            remember_token:
 *              type: string
 *            device_token:
 *              type: string
 *            status:
 *              type: string
 *            birthday:
 *              type: string
 *            gender:
 *              type: string
 *            country:
 *              type: string
 *            refresh_token:
 *              type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    SendCodeVerifyInput:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: example@gmail.com
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    SendCodeVerifyOutput:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Send verify code successfully!
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ResetPasswordInput:
 *      type: object
 *      required:
 *        - email
 *        - code_reset_password
 *        - password
 *        - confirm_password
 *      properties:
 *        email:
 *          type: string
 *          default: example@gmail.com
 *        code_reset_password:
 *          type: string
 *          default: 123456
 *        password:
 *          type: string
 *          default: Admin123@
 *        confirm_password:
 *          type: string
 *          default: Admin123@
 *    ResetPasswordOutput:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Updated password successfully!
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdatePasswordInput:
 *      type: object
 *      required:
 *        - new_password
 *        - new_confirm_password
 *      properties:
 *        password:
 *          type: string
 *          default: Example123@
 *        new_password:
 *          type: string
 *          default: Admin123@
 *        new_confirm_password:
 *          type: string
 *          default: Admin123@
 *    UpdatePasswordOutput:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Updated password successfully!
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    LogoutResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: You have been Logged Out!
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ResendOTPInput:
 *      type: object
 *      required:
 *        - type_id
 *        - user_id
 *      properties:
 *        type_id:
 *          type: number
 *          default: 2
 *        user_id:
 *          type: string
 *          default: "3f94a3a8-1d22-4b43-8b9c-1234567890ab"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CheckOTPInput:
 *      type: object
 *      required:
 *        - otp_token
 *        - user_id
 *      properties:
 *        otp_token:
 *          type: string
 *          default: 123456
 *        user_id:
 *          type: string
 *          default: "3f94a3a8-1d22-4b43-8b9c-1234567890ab"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ConfirmPasswordInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: example@gmail.com
 *        password:
 *          type: string
 *          default: Admin
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ChangePasswordInput:
 *      type: object
 *      required:
 *        - current_password
 *        - new_password
 *        - confirm_password
 *        - user_id
 *      properties:
 *        current_password:
 *          type: string
 *          default: Admin
 *        new_password:
 *          type: string
 *          default: Admin123
 *        confirm_password:
 *          type: string
 *          default: Admin123
 *        user_id:
 *          type: string
 *          default: "3f94a3a8-1d22-4b43-8b9c-1234567890ab"
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateVisitorInput:
 *      type: object
 *      required:
 *        - user_id
 *        - token_id
 *      properties:
 *        user_id:
 *          type: string
 *          default: "3f94a3a8-1d22-4b43-8b9c-1234567890ab"
 *        token_id:
 *          type: string
 *          default:
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UserUpdatePasswordInput:
 *      type: object
 *      required:
 *        - new_password
 *        - new_confirm_password
 *      properties:
 *        password:
 *          type: string
 *          description: Current password
 *        new_password:
 *          type: string
 *          description: New password to set
 *        new_confirm_password:
 *          type: string
 *          description: Confirmation of the new password
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UserUpdatePasswordResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: the data has been updated!
 *        data:
 *          type: boolean
 *          example: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateUserInput:
 *      type: object
 *      properties:
 *        first_name:
 *          type: string
 *          default: Milica
 *        last_name:
 *          type: string
 *          default: Jovanovic
 *        phone:
 *          type: string
 *          default: 0123456789
 *        phone_code:
 *          type: string
 *          default: +84
 *        country:
 *          type: string
 *          default: vi
 *        address:
 *          type: string
 *          default: 133 Tân Cảng, Phường 25, Bình Thạnh, TP.HCM
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateUserOutput:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Updated user successfully!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            email:
 *              type: string
 *            phone:
 *              type: string
 *            phone_code:
 *              type: string
 *            country:
 *              type: string
 *            address:
 *              type: string
 *            avatar:
 *              type: string
 *              nullable: true
 *            last_check_notifcation:
 *              type: string
 *              format: date-time
 *              nullable: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginUserInput:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          default: example@gmail.com
 *        password:
 *          type: string
 *          default: Admin123@
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginSocialUserInput:
 *      type: object
 *      properties:
 *        id_token:
 *          type: string
 *        provider:
 *          type: string
 *          default: Facebook
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    RefreshTokenInput:
 *      type: object
 *      properties:
 *        refresh_token:
 *          type: string
 *          default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTU2YjA4NmQtZjIyZC00M2EzLTg5NjYtNzdkNDEyNTU1YzNlIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY4MDcyNTgwLCJleHAiOjE2NzA2NjQ1ODB9.SvjLLf7EW3xQdQcltjxa3u645YhrKVi_FczCazcl4kI
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: User is created successfully!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            email:
 *              type: string
 *    UserProfileResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Success
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            email:
 *              type: string
 *            phone:
 *              type: string
 *            phone_code:
 *              type: string
 *            country:
 *              type: string
 *            address:
 *              type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: User login successfully!
 *        data:
 *          type: object
 *          properties:
 *            access_token:
 *              type: string
 *            refresh_token:
 *              type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UserNotification:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        user_from:
 *          type: string
 *          nullable: true
 *        user_to:
 *          type: string
 *        title:
 *          type: string
 *        message:
 *          type: string
 *        type:
 *          type: string
 *        post_id:
 *          type: string
 *          nullable: true
 *        is_new:
 *          type: boolean
 *        is_read:
 *          type: boolean
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *    UserNotificationListResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: data has been received!
 *        data:
 *          type: object
 *          properties:
 *            rows:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/UserNotification'
 *            pagination:
 *              type: object
 *              properties:
 *                total_page:
 *                  type: integer
 *                  example: 1
 *                per_page:
 *                  type: integer
 *                  example: 10
 *                current_page:
 *                  type: integer
 *                  example: 1
 *                count:
 *                  type: integer
 *                  example: 1
 *            summay_status:
 *              type: object
 *              properties:
 *                unread_count:
 *                  type: integer
 *                  example: 0
 *                has_new:
 *                  type: boolean
 *                  example: false
 *                last_check:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *    UserNotificationReadResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          example: 200
 *        message:
 *          type: string
 *          example: the data has been updated!
 *        data:
 *          type: boolean
 *          example: true
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ResendOTPResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          default: true
 *        message:
 *          type: string
 *          default: Resend OTP successfully
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CheckOTPResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          default: true
 *        message:
 *          type: string
 *          default: OTP authentication successfully
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ResetPasswordResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          default: true
 *        message:
 *          type: string
 *          default: Password reset email sent successfully
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ConfirmPasswordResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          default: true
 *        message:
 *          type: string
 *          default: Confirm password successfully
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    ChangePasswordResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          default: true
 *        accessToken:
 *          type: string
 *          default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTU2YjA4NmQtZjIyZC00M2EzLTg5NjYtNzdkNDEyNTU1YzNlIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY4MDcyNTgwLCJleHAiOjE2NzA2NjQ1ODB9.SvjLLf7EW3xQdQcltjxa3u645YhrKVi_FczCazcl4kI
 *        message:
 *          type: string
 *          default: Changed password successfully
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateVisitorResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          default: true
 *        token:
 *          type: string
 *          default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTU2YjA4NmQtZjIyZC00M2EzLTg5NjYtNzdkNDEyNTU1YzNlIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY4MDcyNTgwLCJleHAiOjE2NzA2NjQ1ODB9.SvjLLf7EW3xQdQcltjxa3u645YhrKVi_FczCazcl4kI
 *        refresh_token:
 *          type: string
 *          default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTU2YjA4NmQtZjIyZC00M2EzLTg5NjYtNzdkNDEyNTU1YzNlIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY4MDcyNTgwLCJleHAiOjE2NzA2NjQ1ODB9.SvjLLf7EW3xQdQcltjxa3u645YhrKVi_FczCazcl4kI
 *        message:
 *          type: string
 *          default: Visitor created successfully
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    DeleteUserInput:
 *      type: object
 *      properties:
 *        password:
 *          type: string
 *          default: Admin123@
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CheckExistInput:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: example@gmail.com
 */
// User contact
/**
 * @openapi
 * components:
 *  schemas:
 *    UserContactResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Get detail contact passenger successfully!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            email:
 *              type: string
 *            title:
 *              type: string
 *            phone:
 *              type: string
 *            phone_code:
 *              type: string
 *            key:
 *              type: string
 *            country:
 *              type: string
 */

// User passengers
/**
 * @openapi
 * components:
 *  schemas:
 *    UserPassengerResponse:
 *      type: object
 *      properties:
 *        code:
 *          type: number
 *          default: 200
 *        message:
 *          type: string
 *          default: Get detail contact passenger successfully!
 *        data:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            first_name:
 *              type: string
 *            last_name:
 *              type: string
 *            title:
 *              type: string
 *            country_of_issue:
 *              type: string
 *            date_of_birth:
 *              type: string
 *            identity_number:
 *              type: string
 *            identity_expiry_date:
 *              type: string
 *            membership_card_number:
 *              type: string
 *            nationality:
 *              type: string
 *            pax_type:
 *              type: string
 *            passport_number:
 *              type: string
 *            passport_expiry_date:
 *              type: string
 *            key:
 *              type: string
 */
