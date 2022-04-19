import validator from 'validator'
import { EmailValidator}  from '@src/presentation/protocols/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
    public isValidEmail(email: string): boolean {
      const isEmail = validator.isEmail( email )
      return null
    }
  }
