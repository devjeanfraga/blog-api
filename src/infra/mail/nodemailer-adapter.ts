import * as nodemailer from 'nodemailer'
import { NodemailerSendMail } from "@src/data/protocols/nodemailer-send-mail";
import { SendMailParams } from "@src/domain/usecases/send-mail";

export class NodemailerAdapter implements NodemailerSendMail {

  constructor (
    private readonly from: string,
    private readonly host: string,
    private readonly user: string,
    private readonly pass: string,
    private readonly port?: number,

  ) {}

  public async sendMail(params: SendMailParams): Promise<void> {
    let transport;

    if (params.subject === 'Test Verification Email') {

      const configTestEmail = await nodemailer.createTestAccount()
      const testAccount = { host: this.host, auth: configTestEmail }
      transport = nodemailer.createTransport(testAccount)
      
    } else {

      transport = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        auth: {
          user: this.user,
          pass: this.pass
        }
      })

    }

    await transport.sendMail({
      from: this.from,
      to: params.to,
      subject: params.subject,
      text: params.text
    })
  }

}