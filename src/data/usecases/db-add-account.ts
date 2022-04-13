import { AccountModel } from "@src/domain/model/account-model";
import { AddAccount, AddAccountModel } from "@src/domain/usecases/add-account";
import { Hasher } from "@src/data/protocols/hasher";
import { AddAccountRepository } from "@src/data/protocols/add-account-repository";

export class DbAddAccount implements AddAccount {

  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
    ) {}
  public async add (accountData: AddAccountModel ): Promise<AccountModel> {
      const hashedPassword = await this.hasher.hash(accountData.password)
      await this.addAccountRepository.add( Object.assign( {}, accountData, {password: hashedPassword}))
      return new Promise(resolve => resolve(null) )
  } 
}