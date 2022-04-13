import { Controller } from "@src/presentation/protocols/controller"
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http"
import { EmailValidator } from "@src/presentation/protocols/email-validator"
import { MissingParamError } from "@src/presentation/errors/missing-param-error"
import { InvalidParamError } from "@src/presentation/errors/invalid-param-error"
import { AddAccount } from "@src/domain/usecases/add-account"
import { badRequest, ok, serverError } from "@src/presentation/helpers/http-helpers"
import { DirectEmail } from "@src/data/usecases/direct-email"



export class SignUpController implements Controller{

  constructor ( 
    private readonly emailValidator: EmailValidator, 
    private readonly addAccount: AddAccount,
    private readonly directEmail: DirectEmail
  ) {
  
  }

  public  async  handle (httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const fields = [ 'name', 'email', 'password', 'passwordConfirm']

      for( const field of fields) {
        if(!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      
      const isEmail = this.emailValidator.isValidEmail(httpRequest.body.email)
      if(!isEmail) {
        return badRequest(new InvalidParamError('email'))   
      }

      if( httpRequest.body.password != httpRequest.body.passwordConfirm ) {
        return badRequest(new InvalidParamError('password'))
      }

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add( {
        name,
        email, 
        password
      })

      this.directEmail.sendMail({
        to: email,
        subject: 'Verification Email',
        text: `Welcome ${name}, click on link to verify your email`
      })

      return ok(account)

    } catch (err) {
      return serverError(err)
    }

  
  }
}