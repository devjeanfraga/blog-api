import { DirectEmail } from "@src/data/usecases/direct-email"
import { SendMail } from "@src/domain/usecases/send-mail"
import { JwtAdapter } from "@src/infra/cryptography/jwt-adapter"
import { NodemailerAdapter } from "@src/infra/mail/nodemailer-adapter"
import { GenerateUrl } from '@src/data/protocols/generate-url'
import * as config from 'config'
import { IConfig } from "config"

const email: IConfig = config.get('app.smtp')
const encrypter: IConfig = config.get('app.encrypter')

export const makeDirectEmail = (): SendMail => {
  const jwtAdapter = new JwtAdapter(encrypter.get('secretKey'))
  const generateUrl = new GenerateUrl()
  const nodeMailerAdapter = new NodemailerAdapter(email.get('email'), email.get('host'), email.get('user'), email.get('pass'), parseInt(`${email.get('port')}`)
  )
  
  return new DirectEmail(jwtAdapter, generateUrl, nodeMailerAdapter)
}