import { DbAddAccount } from './db-add-account'
import { Hasher } from '@src/data/protocols/criptography/hasher'
import { AddAccountModel } from '@src/domain/usecases/add-account'

describe('DbAddAccount', () => {
  const makeHasherStub = (): Hasher => {
    class HasherStub implements Hasher {
      public hash (value: string): Promise<string> {
        return new Promise(resolver => resolver('password-hashed'))
      }
    }
    return new HasherStub()
  }

  const makeFakeRequest = (): AddAccountModel => ({
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any-password'
  })

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

    await sut.add(makeFakeRequest())
    expect(spyHash).toHaveBeenCalledWith(makeFakeRequest().password)
  })

  it('Should Throws if Hasher Throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce( new Promise((resolve, reject) => reject(new Error()) ))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
    //Garanti que o try-catch nao será implementado justamente para o erro ser lançado a diante 
  })
  
})