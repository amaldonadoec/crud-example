import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorValidationTransformer {
  transform(value: any) {
    return this.transformError(value);
  }

  private transformError(errors: any) {
    return errors.map((error) => {
      return {
        field: error.property,
        code: null,
        value: this.transformItemError(error.constraints),
        constraints:
          error.children.length > 0
            ? this.transformError(error.children)
            : error.constraints,
      };
    });
  }
  private transformItemError(constraints: any) {
    let message = '';
    for (const key in constraints) {
      message += constraints[key];
    }
    return message;
  }
}
