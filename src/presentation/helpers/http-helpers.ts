import { HttpResponse } from '@src/presentation/protocols/http'
import { ServerError }  from '@src/presentation/errors/server-error'

export const serverError = (error: Error): HttpResponse => ({
statusCode: 500,
body: new ServerError(error.stack)
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})