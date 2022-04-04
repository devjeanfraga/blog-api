import { AccountModel } from "@src/domain/model/account-model";
import { AddAccount, AddAccountModel } from "@src/domain/usecases/add-account";
import { Hasher } from "@src/data/protocols/criptography/hasher";

export class DbAddAccount implements AddAccount {
  constructor(private readonly hasher: Hasher) {}
  public async add (account: AddAccountModel ): Promise<AccountModel> {
      this.hasher.hash(account.password)
      return new Promise(resolve => resolve(null) )
  } 
}