import { SendMail, SendMailParams } from "@src/domain/usecases/send-mail";
import { Encrypter } from "../protocols/encrypter";
import { NodemailerSendMail } from "../protocols/nodemailer-send-mail";

export class DirectEmail  implements SendMail {

  constructor( private readonly encrypter: Encrypter, private readonly nodemailerSendMail: NodemailerSendMail) {}

  public async sendMail ( params: SendMailParams ): Promise<void> {
    const tokenToCheckEmail = this.encrypter.encrypt(params.to)
    await this.nodemailerSendMail.sendMail( params )
    return null
  }
}