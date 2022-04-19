import validator from "validator"
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator')
const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidadtorAdapter', () => {
  it('Should call isEmail with correct values', () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(validator , "isEmail")
    sut.isValidEmail('any@mail.com')
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })
})