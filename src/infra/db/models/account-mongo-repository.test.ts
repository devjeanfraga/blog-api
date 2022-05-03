import { 
  AccountMongoRepository,
  MongoHelper,
  AccountMongooseModel,
  AccountModel,
} from "./account-mongo-repository-protocols"
import * as config from 'config'

describe('AccountMongoRepository', () => {
  beforeAll( async () => {
    await MongoHelper.connect( config.get('app.db.url') )
  })

  afterAll( async () => {
    await AccountMongooseModel.deleteMany({})
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  const makeAccountParams = (): AccountModel => ({
    id: 'any-id',
    name: 'any-name',
    email: 'any@mail.com',
    password: 'any-password'
  })

  describe('AddAccountMongoRepository', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut()
      const accountParams = makeAccountParams()
      const account = await sut.add( accountParams )
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountParams.name)
      expect(account.email).toBe(accountParams.email)
      expect(account.password).toBe(accountParams.password)
    })

  })
})

// import { MongoHelper } from "../mongo-helper"
// import { default as AccountMongooseModel } from '../models/account-model'
// import { AccountModel } from "@src/domain/model/account-model"