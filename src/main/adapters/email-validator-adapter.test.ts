import validator from "validator"
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator').fn(()=> ({
  isEmail():boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()


describe('EmailValidadtorAdapter', () => {
  it('Should call isEmail with correct values', () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(validator , "isEmail")
    sut.isValidEmail('any@mail.com')
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('Should return true if isEmail ruturns true', async () => {
    const sut = makeSut()
    const isValidEmail =  sut.isValidEmail('any@mail.com')
    expect(isValidEmail).toBeTruthy()
  })

  it('Should return false if isEmail ruturns false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValidEmail =  sut.isValidEmail('any@mail.com')
    expect(isValidEmail).toBeFalsy()
  })

  
})