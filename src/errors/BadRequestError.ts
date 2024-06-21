import { errorTypeEnum } from '../utils/enums';
import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string, data?: Object) {
    super(message, 400, errorTypeEnum.BAD_REQUEST, data);
  }
}
