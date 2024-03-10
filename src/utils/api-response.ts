export interface IAppResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export class AppResponse<T> implements IAppResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: true;

  constructor(message: string) {
    this.message = message;
  }

  setSuccessData(data: T): this {
    this.data = data;
    return this;
  }

  setStatus(status: number): this {
    this.statusCode = status;
    return this;
  }
}
