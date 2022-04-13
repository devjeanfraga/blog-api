import { AccountModel } from "@src/domain/model/account-model"
import { SendMailParams } from "@src/domain/usecases/send-mail"
import { NodemailerSendMail } from "../protocols/nodemailer-send-mail"
import { DirectEmail } from "./direct-email"

const makeNodemailerSendMail = (): NodemailerSendMail => {
  class NodemailerSendMailStub implements NodemailerSendMail {
    sendMail(arams: SendMailParams): Promise<void> {
      return null
    }
  }
  return new NodemailerSendMailStub()
}



const makeFakeSendMailParams = (): SendMailParams => ({
  to: 'any@mail.com',
  subject: 'any-subject',
  text: 'any-text'
})

interface SutTypes {
  sut: DirectEmail,
  nodemailerSendMailStub: NodemailerSendMail
}

const makeSut = (): SutTypes => {
  const nodemailerSendMailStub = makeNodemailerSendMail()
  const sut = new DirectEmail(nodemailerSendMailStub)
  return {
    sut,
    nodemailerSendMailStub
  }
}

describe('DirectEmail UseCase', () => {
  it('Should calls NodemailerSendMail with correct values', async () => {
    const { sut, nodemailerSendMailStub } = makeSut()
    const spySendMail = jest.spyOn( nodemailerSendMailStub, 'sendMail' )

    await sut.sendMail(makeFakeSendMailParams())
    expect(spySendMail).toHaveBeenCalledWith({
      to: 'any@mail.com',
      subject: 'any-subject',
      text: 'any-text'
    })
  })
})