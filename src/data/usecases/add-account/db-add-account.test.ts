import { DbAddAccount } from './db-add-account'
import { Hasher } from '@src/data/protocols/criptography/hasher'
import { AddAccount, AddAccountModel } from '@src/domain/usecases/add-account'
import { AccountModel } from '@src/domain/model/account-model'
import { AddAccountRepository } from '@src/data/protocols/db/add-account-repository'

describe('DbAddAccount', () => {

  const makeFakeRequest = (): AddAccountModel => ({
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any-password'
  })

  const makeFakeAccount = (): AccountModel => ({
    id: 'any-id',
    name: 'any-name',
    email: 'any@mail.com',
    password: 'hashed-password'
  })

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub  implements AddAccount {
      public async add (account: AddAccountModel ): Promise<AccountModel> {   
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeHasher = (): Hasher => {
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
    addAccountRepositoryStub: AddAccountRepository
  }
  const makeSut = (): SutTypes => {
    const addAccountRepositoryStub = makeAddAccountRepository()
    const hasherStub = makeHasher()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
      sut,
      hasherStub,
      addAccountRepositoryStub
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

  it('Should calls AddAccountRepository with corret values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const spyAdd = jest.spyOn(addAccountRepositoryStub, 'add')
    
    await sut.add(makeFakeRequest())
    expect(spyAdd).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any@mail.com',
      password: 'password-hashed'
    })
  })
  
})