import { DbAddAccount } from './db-add-account'
import { Hasher } from '@src/data/protocols/criptography/hasher'

describe('DbAddAccount', () => {
  const makeHasherStub = (): Hasher => {
    class HasherStub implements Hasher {
      public hash (value: string): Promise<string> {
        return new Promise(resolver => resolver('password-hashed'))
      }
    }
    return new HasherStub()
  }

  interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
  }
  const makeSut = (): SutTypes => {
    const hasherStub = makeHasherStub()
    const sut = new DbAddAccount(hasherStub)
    return {
      sut,
      hasherStub
    }
  }

  it('Should calls hasher with correct password', async () => {
    const {sut, hasherStub } = makeSut()
    const spyHash =  jest.spyOn(hasherStub, 'hash')
    const fakeAccount = {
      name: 'any-name',
      email: 'any@mail.com',
      password: 'any-password'
    }
    await sut.add(fakeAccount)
    expect(spyHash).toHaveBeenCalledWith(fakeAccount.password)
  })

  
})