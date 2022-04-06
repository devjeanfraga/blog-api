import { SignUpController } from './signup'
import { HttpRequest } from '@src/presentation/protocols/http'
import { EmailValidator } from '@src/presentation/protocols/email-validator'
import { MissingParamError} from '@src/presentation/errors/missing-param-error'
import { InvalidParamError } from '@src/presentation/errors/invalid-param-error'
import { AddAccount, AddAccountModel} from '@src/domain/usecases/add-account'
import { AccountModel } from '@src/domain/model/account-model'
import { ServerError } from '@src/presentation/errors/server-error'
import { SendEmail } from '@src/domain/usecases/send-mail'


const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any-password',
    passwordConfirm: 'any-password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any@mail.com',
  password: 'hashed-password'
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValidEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    public add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeSendEmail = (): SendEmail => {
  class SendEmailStub implements SendEmail {
    public send(credentials: AccountModel): void {
      return null
    }
  }
  return new SendEmailStub()
}

interface TypesSut {
  sut: SignUpController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount
  sendEmailStub: SendEmail
}
const makeSut = (): TypesSut  => {
  const sendEmailStub = makeSendEmail()
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, sendEmailStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    sendEmailStub
  }
}

describe('SignUp Controller', () => {
  
  it('Should return an Error if name field missing', async () => {
      const { sut } = makeSut()
      const fakeHttpRequest = {
        body: {
          //name: 'any-name',
          email: 'any@mail.com',
          password: 'any-password',
          passwordConfirm: 'any-password'
        }
      }
      const error =  await sut.handle(fakeHttpRequest)
      const response = {
        body: new MissingParamError('name'),
        statusCode: 400
      }
      expect(error).toEqual(response)
  })

  it('Should return an Error if email field missing', async () => {
    const { sut } = makeSut()
    const fakeHttpRequest = {
      body: {
        name: 'any-name',
        //email: 'any@mail.com',
        password: 'any-password',
        passwordConfirm: 'any-password'
      }
    }
    const error =  await sut.handle(fakeHttpRequest)
    const response = {
      body: new MissingParamError('email'),
      statusCode: 400
    }
    expect(error).toEqual(response)
  })

  it('Should return an Error if password field missing', async () => {
  const { sut } = makeSut()
  const fakeHttpRequest = {
    body: {
      name: 'any-name',
      email: 'any@mail.com',
      //password: 'any-password',
      passwordConfirm: 'any-password'
    }
  }
  const error = await sut.handle(fakeHttpRequest)
  const response = {
    body: new MissingParamError('password'),
    statusCode: 400
  }
  expect(error).toEqual(response)
  })

  it('Should return an Error if passwordConfirm field missing', async () => {
    const { sut } = makeSut()
    const fakeHttpRequest = {
      body: {
        name: 'any-name',
        email: 'any@mail.com',
        password: 'any-password',
        //passwordConfirm: 'any-password'
      }
    }
    const error = await sut.handle(fakeHttpRequest)
    const response = {
      body: new MissingParamError('passwordConfirm'),
      statusCode: 400
    }
    expect(error).toEqual(response)
  })

  it('Should call EmailValidator with correct values', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const spyIsValidMail = jest.spyOn(emailValidatorStub, 'isValidEmail')

      await sut.handle(makeFakeRequest())
      expect(spyIsValidMail).toHaveBeenCalledWith(makeFakeRequest().body.email)
  })
  
  it('Should return an InvalidParamErrror if Emailvalidator return false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValidEmail').mockReturnValueOnce(false)

    const promise = await sut.handle(makeFakeRequest())
    expect(promise).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email')
    })

  })

  it('Should return an InvalidParamError if password field donts match', async ()=> {
    const { sut } = makeSut()

    const request = {
      body: {
        name: 'any-name',
        email: 'any@mail.com',
        password: 'any-password',
        passwordConfirm: 'any-fail-password'
      }
    }

    const promise = await sut.handle(request)
    expect(promise).toEqual({
      statusCode: 400,
      body: new InvalidParamError('password')
    })
  })

  it('Should calls AddAccount with correct  values',  async () => {
    const { sut, addAccountStub } = makeSut()
    const spyAdd = jest.spyOn(addAccountStub, 'add')

    const validRequest = {
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password'
    }

    await sut.handle(makeFakeRequest())
    expect(spyAdd).toHaveBeenCalledWith(validRequest)
  })


  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'any-id',
      name: 'any-name',
      email: 'any@mail.com',
      password: 'hashed-password'
    })
  })

  it('Should calls SendVerificationEmail with correct values', async () => {
    const { sut, sendEmailStub } = makeSut()
    const spySend = jest.spyOn( sendEmailStub, 'send')

    await sut.handle(makeFakeRequest())
    expect(spySend).toHaveBeenCalledWith(makeFakeAccount())
  })

  it('Should return 500 if addAccount failure', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(()=> {
      throw new Error()
    })

    const promise = await sut.handle(makeFakeRequest())
    expect(promise).toEqual( {
    statusCode: 500,
    body: new ServerError('anyError')
    }) 

  })


})