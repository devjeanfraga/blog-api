import { SendMail, SendMailParams } from "@src/domain/usecases/send-mail";
import { NodemailerSendMail } from "../protocols/nodemailer-send-mail";

export class DirectEmail  implements SendMail {

  constructor( private readonly nodemailerSendMail: NodemailerSendMail) {}

  public async sendMail ( params: SendMailParams ): Promise<void> {
     await this.nodemailerSendMail.sendMail( params )
     return null
  }
}