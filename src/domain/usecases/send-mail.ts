import { AccountModel } from "../model/account-model";

export interface SendEmail {
  send ( credentials: AccountModel ): void 
}