import { Controller } from "@src/presentation/protocols/controller"
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http"

export class SignUpController implements Controller {

  public async handle (httpRequest: HttpRequest):  Promise<HttpResponse> {
    const {name, email, password, passwordConfirm} = httpRequest.body

    const fields = ['name', 'email', 'password', 'passwordConfirm']

      for( const field of fields) {
        if(!httpRequest.body[field]) {
          const requiredField = (): HttpResponse => ({ statusCode: 400, body: new Error('some field is required') })
          return requiredField()
      }
    }
    return new Promise(resolve => resolve)
  }
}