type HttpStatusErrorParams = {
  status: number;
  headers?: Headers;
};

export class HttpStatusError extends Error {
  status: number;
  headers?: Headers;

  constructor({ status, headers }: HttpStatusErrorParams) {
    super(`Request failed with status ${status}`);
    this.name = 'HttpStatusError';
    this.status = status;
    this.headers = headers;
  }
}
