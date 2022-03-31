export class InvalidParamError extends Error {
  constructor(fieldName: string) {
    super(`Param ${fieldName} is invalid`)
    this.name = 'InavlidParamError'
  }
}