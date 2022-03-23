import { SignUpController } from "./signup"
import { HttpRequest } from "@src/presentation/protocols/http"

const makeFakeRequest = (): HttpRequest => ({
  body: {

    email: 'any@mail.com',
    password: 'any-password',
    passwordConfirm: 'any-password'
  }
})

interface TypesSut {
  sut: SignUpController
}
const makeSut = (): TypesSut  => {
  const sut = new SignUpController()
  return {
    sut
  }
}

describe('SignUp Controller', () => {
  
  it('Should return an Error if any field missing', async () => {
      const { sut } = makeSut()
      const error = await sut.handle(makeFakeRequest())
      const response = {
        body: new Error('some field is required'),
        statusCode: 400
      }
      
      expect(error).toEqual(response)
  } )
})