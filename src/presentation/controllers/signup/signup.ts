import { 
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  MissingParamError,
  InvalidParamError,
  AddAccount,
  badRequest,
  ok, 
  serverError,
  SendMail

} from './signup-protocols'




export class SignUpController implements Controller{

  constructor ( 
    private readonly emailValidator: EmailValidator, 
    private readonly addAccount: AddAccount,
    private readonly sendMail: SendMail
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

      this.sendMail.sendMail({
        to: email,
        subject: 'Test Verification Email',
        text: `Welcome ${name}, click on link to verify your email`
      })

      return ok(account)

    } catch (err) {
      return serverError(err)
    }

  
  }
}