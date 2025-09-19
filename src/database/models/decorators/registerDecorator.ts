import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({name: 'validatePassword', async: false})
export class ValidatePassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const minLength = 6; // Độ dài tối thiểu của mật khẩu
    // const requireLowerCase = true; // Yêu cầu có ít nhất một chữ thường
    // const requireUpperCase = true; // Yêu cầu có ít nhất một chữ hoa
    const requireNumbers = true; // Yêu cầu có ít nhất một số
    // const requireSymbols = true; // Yêu cầu có ít nhất một ký tự đặc biệt

    if (password.length < minLength) {
      return false;
    }

    // if (requireLowerCase && !/[a-z]/.test(password)) {
    //   return false;
    // }

    // if (requireUpperCase && !/[A-Z]/.test(password)) {
    //   return false;
    // }

    if (requireNumbers && !/\d/.test(password)) {
      return false;
    }

    // if (requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   return false;
    // }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return "";
  }
}
