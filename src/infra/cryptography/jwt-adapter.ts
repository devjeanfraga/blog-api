import * as jwt from 'jsonwebtoken'
import { Encrypter } from "@src/data/protocols/encrypter";

export class JwtAdapter implements Encrypter {

  constructor (private readonly secretKey: string) {}

  public async encrypt(value: string): Promise<string> {
    const hashedValue = jwt.sign(value, this.secretKey)
    return hashedValue
  }
}