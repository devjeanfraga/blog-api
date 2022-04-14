import { SendMailParams } from "@src/domain/usecases/send-mail"
import { NodemailerSendMail } from "../protocols/nodemailer-send-mail"
import { DirectEmail } from "./direct-email"

const makeNodemailerSendMail = (): NodemailerSendMail => {
  class NodemailerSendMailStub implements NodemailerSendMail {
    sendMail(params: SendMailParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new NodemailerSendMailStub()
}

const throwError = (): never => {
  throw new Error()
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

  it('Should throw if NodemailerSendMail throws', async () => {
    const { sut, nodemailerSendMailStub } = makeSut()
    jest.spyOn( nodemailerSendMailStub, 'sendMail').mockImplementationOnce( throwError)
    const promise = sut.sendMail(makeFakeSendMailParams())
    await expect(promise).rejects.toThrow()
  })
})