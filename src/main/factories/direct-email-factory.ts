import { DirectEmail } from "@src/data/usecases/direct-email";
import { SendMail } from "@src/domain/usecases/send-mail";
import { NodemailerAdapter } from "@src/infra/nodemailer-adapter";
import * as config from 'config'
import { IConfig } from "config";

const email: IConfig = config.get('app.smtp')

export const makeDirectEmail = (): SendMail => {
  const nodeMailerAdapter = new NodemailerAdapter(
    email.get('email'),
    email.get('host'),
    email.get('user'),
    email.get('pass'),
    parseInt(`${email.get('port')}`)
  )
  return new DirectEmail(nodeMailerAdapter)
}