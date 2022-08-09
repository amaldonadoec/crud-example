import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// VALIDATORS CONSTRAINT
@ValidatorConstraint({ async: true })
export class ActivationDateConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const status = args.object[0];
    if (status === 'ACTIVE') {
      return value ? true : false;
    }
    return true;
  }
  defaultMessage() {
    return 'The date is required when status is ACTIVE';
  }
}

// DECORATORS
export function ActivationDate(
  status: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [status],
      validator: ActivationDateConstraint,
    });
  };
}

// VALIDATORS CONSTRAINT
@ValidatorConstraint({ async: true })
export class IsRealNameConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    var regName =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    return regName.test(value);
  }
  defaultMessage() {
    return 'Invalid name/lastName given.';
  }
}

// DECORATORS
export function IsRealName(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRealNameConstraint,
    });
  };
}

export function DocumentValidation(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ConstraintDocumentValidation,
    });
  };
}

@ValidatorConstraint({ async: true })
export class ConstraintDocumentValidation
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    value = value.toString();
    return this.validDocument(value, 'RUC') || this.validDocument(value, 'CI');
  }
  defaultMessage() {
    return 'Document is not valid';
  }

  validDocument(value: any, documentType: string) {
    const documentValidationCases = {
      CI: (document: string) => {
        return this.validateCI(document);
      },
      RUC: (document: any) => {
        return this.validateRUCAndPersonType(document);
      },

      default: () => {
        return false;
      },
    };

    return (
      documentValidationCases[documentType] ||
      documentValidationCases['default']
    )(value);
  }

  public validateCI = (document: any) => {
    const CICoefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    return (
      this.validateProvince(document.substring(0, 2)) &&
      this.validateEcuadorianCI(document, CICoefficients)
    );
  };

  public validateEcuadorianCI = (document: any, coefficient: any) => {
    let sumDigitsPerCoefficient = 0;
    let value = 0;
    for (let i = 0; i < coefficient.length; i++) {
      const digit = document.charAt(i) * 1;
      value = coefficient[i] * digit;
      if (value > 9) {
        value = value - 9;
      }
      sumDigitsPerCoefficient = sumDigitsPerCoefficient + value;
    }
    let divisonModule = sumDigitsPerCoefficient % 10;
    divisonModule = divisonModule === 0 ? 10 : divisonModule;
    const result = 10 - divisonModule;
    const lastDigit = document.charAt(9) * 1;
    if (result === lastDigit) {
      return true;
    }
    return false;
  };

  public validateProvince = (document: any) => {
    if (parseInt(document) <= 0 || parseInt(document) > 24) {
      return false;
    }
    return true;
  };

  public validateRUCAndPersonType = (document: any) => {
    const coefficientsRucLegalPerson = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    const coefficientsRucPublicCompany = [3, 2, 7, 6, 5, 4, 3, 2];
    return (
      (this.isNaturalPersonRuc(document) && this.validateCI(document)) ||
      (this.isLegalPersonRuc(document) &&
        this.validateRUC(
          document,
          coefficientsRucLegalPerson,
          document.charAt(9),
        )) ||
      (this.isPublicCompanyRUC(document) &&
        this.validateRUC(
          document,
          coefficientsRucPublicCompany,
          document.charAt(8),
        ))
    );
  };

  public isNaturalPersonRuc = (document: any) => {
    if (
      document.length === 13 &&
      document.charAt(2) !== '6' &&
      document.charAt(2) !== '9' &&
      document.substring(10, 13) === '001'
    ) {
      return true;
    }
    return false;
  };

  public isLegalPersonRuc = (document: any) => {
    if (this.lastDigitsRuc(document) && document.charAt(2) === '9') {
      return true;
    }
    return false;
  };

  public isPublicCompanyRUC = (document: any) => {
    if (this.lastDigitsRuc(document) && document.charAt(2) === '6') {
      return true;
    }
    return false;
  };

  public lastDigitsRuc = (document: any) => {
    if (document.length === 13 && document.substring(10, 13) === '001') {
      return true;
    }
    return false;
  };

  public validateRUC = (document: any, coefficients: any, checkDigit: any) => {
    const id = document;
    const checker = checkDigit * 1;
    let totalSumDigitsPerCoefficient = 0;
    let digit = 0;
    let value = 0;
    for (let i = 0; i < coefficients.length; i++) {
      digit = id.charAt(i) * 1;
      value = coefficients[i] * digit;
      totalSumDigitsPerCoefficient = totalSumDigitsPerCoefficient + value;
    }
    const divisionModule = totalSumDigitsPerCoefficient % 11;
    let result = 0;
    if (divisionModule !== 0) {
      result = 11 - divisionModule;
    }

    if (result === checker) {
      return true;
    }
    return false;
  };
}
