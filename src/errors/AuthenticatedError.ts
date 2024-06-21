import { errorTypeEnum } from '../utils/enums';
import { AppError } from './AppError';

export class AuthenticatedError extends AppError {
  constructor(data?: Object) {
    super('Authenticated error', 401, errorTypeEnum.AUTHENTICATED, data);
  }
}
