import { 
  AccountMongoRepository,
  SignUpController,
  Controller,
  EmailValidatorAdapter,
  makeDirectEmail
 } from './signup-factory-protocols'


export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const directEmailFactory = makeDirectEmail() 

  return new SignUpController(emailValidatorAdapter, accountMongoRepository, directEmailFactory)
}


// import { SignUpController } from "@src/presentation/controllers/signup/signup";
// import { Controller } from "@src/presentation/protocols/controller";
// import { EmailValidatorAdapter } from "../adapters/email-validator-adapter";
// import { makeDirectEmail } from "./direct-email-factory";