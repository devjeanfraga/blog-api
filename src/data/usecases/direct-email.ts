import { SendMail, SendMailParams } from "@src/domain/usecases/send-mail";

export class DirectEmail  implements SendMail {
  sendMail(params: SendMailParams): Promise<void> {
    return null 
  }
}