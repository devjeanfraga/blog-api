import { DirectEmail } from "@src/data/usecases/direct-email";
import { SendMail } from "@src/domain/usecases/send-mail";
import { NodemailerAdapter } from "@src/infra/nodemailer-adapter";
import env from '@src/main/config/env'

export const makeDirectEmail = (): SendMail => {
  const nodeMailerAdapter = new NodemailerAdapter(
    env.smtpMail,
    env.smtpHost,
    env.smtpUser,
    env.smtpPass,
    parseInt(`${env.smtpPort}`)
  )
  return new DirectEmail(nodeMailerAdapter)
}