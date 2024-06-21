import { errorTypeEnum } from '../utils/enums';
import { AppError } from './AppError';

export class ValidationError extends AppError {
  public errors: Object;

  constructor(errors: Object, data?:Object) {
    super('Validation error', 400, errorTypeEnum.VALIDATION, data);
    this.errors = errors;
  }
}
