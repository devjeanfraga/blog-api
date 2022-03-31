import { Controller } from "@src/presentation/protocols/controller"
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http"
import { EmailValidator } from "@src/presentation/protocols/email-validator"
import { MissingParamError } from "@src/presentation/errors/missing-param-error"
import { InvalidParamError } from "@src/presentation/errors/invalid-param-error"
import { AddAccount } from "@src/domain/usecases/add-account"
import { ServerError } from "@src/presentation/errors/server-error"

export class SignUpController implements Controller{

  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  public  async  handle (httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const fields = [ 'name', 'email', 'password', 'passwordConfirm']

      for( const field of fields) {
        if(!httpRequest.body[field]) {
          const requiredField = (): HttpResponse => ({ statusCode: 400, body: new MissingParamError(field) })
          return requiredField()
          //return new Promise(resolve => resolve(requiredField()))
        }
      }
      
      const isEmail = this.emailValidator.isValidEmail(httpRequest.body.email)
      if(!isEmail) {
        return {
          statusCode: 400,
          body: new InvalidParamError('email')
        }
      }

      if( httpRequest.body.password != httpRequest.body.passwordConfirm ) {
        return {
          statusCode: 400,
          body: new InvalidParamError('password')
        }
      }

      const { name, email, password } = httpRequest.body
      const newAccount = this.addAccount.add( {
        name,
        email, 
        password
      })

      return {
        statusCode: 200,
        body: newAccount
      }
    } catch (err) {
      return { 
        statusCode: 500,
        body: new ServerError(err)
      }
    }

  
  }
}