import { SendMailParams } from "@src/domain/usecases/send-mail";

export interface NodemailerSendMail {
  sendMail (params: SendMailParams): Promise<void> 
}