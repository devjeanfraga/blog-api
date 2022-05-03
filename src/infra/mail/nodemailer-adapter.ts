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
    let transportConfig;

    if (params.subject === 'Test Verification Email') {
      const configTestEmail = await nodemailer.createTestAccount()
      transportConfig = { host: this.host, auth: configTestEmail }
    
    } else {
      transportConfig = {
        host: this.host,
        port: this.port,
        auth: { user: this.user, pass: this.pass }
      }
    }

    const transport = nodemailer.createTransport(transportConfig)
    const info = await transport.sendMail({
      from: this.from,
      to: params.to,
      subject: params.subject,
      text: params.text
    })
    
    if ( process.env.NODE_ENV !== 'production' ) { 
      //para recurperar o link do email teste
      console.log("URL : " + nodemailer.getTestMessageUrl(info));
    };
  }

}