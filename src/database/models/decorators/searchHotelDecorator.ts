import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({async: false})
export class IsDateGreaterThanOrEqualTodayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let checkinDate = new Date(value);
    checkinDate.setHours(0, 0, 0, 0);

    return checkinDate >= currentDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The checkin must be greater than the current date';
  }
}

@ValidatorConstraint({async: false})
export class IsDateGreaterThanCheckinConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    let checkIn = new Date((args.object as any).check_in);
    checkIn.setHours(0, 0, 0, 0);
    let checkOut = new Date(value);
    checkOut.setHours(0, 0, 0, 0);

    return checkOut > checkIn;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The checkout must be greater than checkin by at least 1 day';
  }
}

@ValidatorConstraint({async: false})
export class IsListRoomsValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const {adult, child} = args.object as any;
    if (adult <= 0) {
      return false;
    }

    if (adult < 1 || adult + child > 9) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each room must have at least 1 adult, and the total of adults and children must not exceed 9';
  }
}

export function IsDateGreaterThanOrEqualToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateGreaterThanOrEqualTodayConstraint,
    });
  };
}

export function IsDateGreaterThanCheckin(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateGreaterThanCheckinConstraint,
    });
  };
}

export function IsListRoomsValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsListRoomsValidConstraint,
    });
  };
}
