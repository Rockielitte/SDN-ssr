import { errorTypeEnum } from '../utils/enums';
import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor() {
    super('Url not found', 404, errorTypeEnum.NOT_FOUND);
  }
}
