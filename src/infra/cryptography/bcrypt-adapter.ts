import * as bcrypt  from 'bcrypt'
import { Hasher } from "@src/data/protocols/hasher";

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}

  public async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash( value, this.salt)
    return hashedValue
  }
}