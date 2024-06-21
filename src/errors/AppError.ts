import { errorTypeEnum } from "../utils/enums";

export class AppError extends Error {
  public statusCode: number;
  public type: errorTypeEnum;
  public message: string;
  public data: Object;
  constructor(message: string, statusCode: number, type: errorTypeEnum, data?: Object) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.data = data;
  }
}
