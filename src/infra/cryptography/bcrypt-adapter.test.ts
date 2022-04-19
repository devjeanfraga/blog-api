import * as bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed-value')
  }, 

}))

const salt = 12
const makeSut = (salt: number): BcryptAdapter => new BcryptAdapter(salt)

describe('BcryptAdapter', () => {

  
  it('Should calls hash with correct values', async () => {
    const sut = makeSut(salt)
    const hashSpy = jest.spyOn( bcrypt, 'hash')
    await sut.hash('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })
})