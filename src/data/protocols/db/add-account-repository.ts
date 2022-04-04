import { AccountModel } from "@src/domain/model/account-model";
import { AddAccount, AddAccountModel } from "@src/domain/usecases/add-account";

export class AddAccountRepository implements AddAccount {
  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    return new Promise(resolve => resolve(null))
  }
}