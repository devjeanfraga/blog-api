import * as jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', ()=> ({
  sign(): Promise<string> {
    return Promise.resolve('access-token')
  }
}))

const secret = 'any-secretKey'
const makeSut = (secretKey: string): JwtAdapter => {
  return new JwtAdapter(secretKey)
}

describe('JwtAdapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = makeSut(secret)
    const spySign = jest.spyOn( jwt, 'sign')

    await sut.encrypt('any-value')
    expect(spySign).toHaveBeenCalledWith('any-value', secret)
  })
  
  it('Should return accessToken if sign on success', async () => {
    const sut = makeSut(secret)

    const accessToken = await sut.encrypt('any-value')
    expect(accessToken).toEqual(expect.any(String))
  })

})