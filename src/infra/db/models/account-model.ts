import { model, Schema, Document, Model } from 'mongoose'
import { AccountModel } from '@src/domain/model/account-model' 

/*** PROTOCOLS ***/
// export type AccountDocument = AccountModel & Document & { id: Document[ '_id' ] }
export interface AccountDocument extends AccountModel, Document { id: Document['_id'] } 
export type AccountMongooseModel = Model<AccountDocument> & { id: Document['_id'] }
enum SchemasNames { account = 'accounts' }

/*** MODEL/Schema ***/
const AccountSchema = new Schema<AccountDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      uniquie: true,
      sparse: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      trim: true
    },
  }
)

export default model<AccountDocument, AccountMongooseModel>( SchemasNames.account, AccountSchema )