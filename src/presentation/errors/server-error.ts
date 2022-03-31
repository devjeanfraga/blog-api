export class ServerError extends Error {
  constructor(stack: string) {
    super('Sorry, internal server error, try later again')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}