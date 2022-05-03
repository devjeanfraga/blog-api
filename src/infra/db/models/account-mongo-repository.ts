import { AddAccountRepository } from "../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../domain/model/account-model";
import { AddAccountModel } from "../../../domain/usecases/add-account";
import { default as AccountMongooseModel} from '../models/account-model'
import { MongoHelper } from "../mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {

  public async add (accountData: AddAccountModel): Promise<AccountModel> {
    const doc = new AccountMongooseModel( accountData )
    await doc.save()
    const parseDoc = JSON.parse(JSON.stringify(doc))
    return MongoHelper.serialize(parseDoc)
  }

}