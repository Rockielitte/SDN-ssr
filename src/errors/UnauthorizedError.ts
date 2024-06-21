import { errorTypeEnum } from '../utils/enums';
import { AppError } from './AppError';

export class UnAuthorizedError extends AppError {
  constructor() {
    super('UnAuthorized error', 401, errorTypeEnum.UNAUTHORIZED);
  }
}
