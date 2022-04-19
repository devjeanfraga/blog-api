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
    const transport = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pass
      }
    })

    await transport.sendMail({
      from: this.from,
      to: params.to,
      subject: params.subject,
      text: params.text
    })
  }

}