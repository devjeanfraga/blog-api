import { SendMail, SendMailParams } from "@src/domain/usecases/send-mail";
import { Encrypter } from "../protocols/encrypter";
import { GenerateUrl } from "../protocols/generate-url";
import { NodemailerSendMail } from "../protocols/nodemailer-send-mail";

export class DirectEmail  implements SendMail {

  constructor( 
    private readonly encrypter: Encrypter, 
    private readonly generateUrl: GenerateUrl, 
    private readonly nodemailerSendMail: NodemailerSendMail
  ) {}

  public async sendMail ( params: SendMailParams ): Promise<void> {
    const tokenToCheckEmail = await this.encrypter.encrypt(params.to)
    const adress =  this.generateUrl.generate('/user/check-email/', tokenToCheckEmail)

    const format = { to: params.to, subject: params.subject, text: `${params.text}: ${adress}`}
    await this.nodemailerSendMail.sendMail( format )
    return null
  }
}