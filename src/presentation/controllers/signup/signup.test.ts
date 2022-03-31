import { SignUpController } from "./signup"
import { HttpRequest } from "@src/presentation/protocols/http"
import { EmailValidator } from "@src/presentation/protocols/email-validator"
import { MissingParamError} from '@src/presentation/errors/missing-param-error'
import { InvalidParamError } from "@src/presentation/errors/invalid-param-error"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any-password',
    passwordConfirm: 'any-password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValidEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface TypesSut {
  sut: SignUpController,
  emailValidatorStub: EmailValidator
}
const makeSut = (): TypesSut  => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
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
      const error =  sut.handle(fakeHttpRequest)
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
    const error =  sut.handle(fakeHttpRequest)
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
  const error =  sut.handle(fakeHttpRequest)
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
    const error =  sut.handle(fakeHttpRequest)
    const response = {
      body: new MissingParamError('passwordConfirm'),
      statusCode: 400
    }
    expect(error).toEqual(response)
  })

  it('Should call EmailValidator with correct values',   () => {
      const { sut, emailValidatorStub } = makeSut()
      const spyIsValidMail = jest.spyOn(emailValidatorStub, 'isValidEmail')

      sut.handle(makeFakeRequest())
      expect(spyIsValidMail).toHaveBeenCalledWith(makeFakeRequest().body.email)
    })
  
  it('Should return an InvalidParamsErrror if Emailvalidator return false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValidEmail').mockReturnValueOnce(false)

    const promise = sut.handle(makeFakeRequest())
    expect(promise).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email')
    })

  })


})