import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({async: false})
class IsPostOrLocationProvidedConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;

    // Check for post_id and post_code
    const postFieldsProvided = !!object.post_id && !!object.post_code;

    // Check for location_lat and location_lng
    const locationFieldsProvided = !!object.location_lat && !!object.location_lng;

    return postFieldsProvided || locationFieldsProvided;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Please enter a destination to start searching.';
  }
}

export function IsPostOrLocationProvided(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPostOrLocationProvidedConstraint,
    });
  };
}
