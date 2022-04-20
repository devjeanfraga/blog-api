import { SendMailParams } from "@src/domain/usecases/send-mail"
import { NodemailerSendMail } from "../protocols/nodemailer-send-mail"
import { DirectEmail } from "./direct-email"
import {AccountModel} from '@src/domain/model/account-model'
import { Encrypter } from "../protocols/encrypter"
import { GenerateUrl } from "../protocols/generate-url"



const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    public encrypt(value: string): Promise<string> {
      return Promise.resolve('any-token')
    }
  }
  return new EncrypterStub()
}

const makeGenerateUrl = (): GenerateUrl => {
  class GenerateURLStub implements GenerateUrl {
    public generate(route: string, token: string): string {
      return 'any-adress'
    }
  }
  return new GenerateURLStub()
}
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

const makeFakeAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any@mail.com',
  password: 'nay-password'
})

const makeFakeSendMailParams = (): SendMailParams => ({
  to: 'any@mail.com',
  subject: 'any-subject',
  text: 'any-text'
})

interface SutTypes {
  sut: DirectEmail,
  encrypterStub: Encrypter
  generateUrlStub: GenerateUrl
  nodemailerSendMailStub: NodemailerSendMail
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const generateUrlStub = makeGenerateUrl()
  const nodemailerSendMailStub = makeNodemailerSendMail()
  const sut = new DirectEmail(encrypterStub, generateUrlStub, nodemailerSendMailStub )
  return {
    sut,
    encrypterStub,
    generateUrlStub,
    nodemailerSendMailStub,
  }
}

describe('DirectEmail UseCase', () => {
  it('Should calls Encrypter with correct values', async () => {
    const {sut, encrypterStub } = makeSut()
    const spyEncrypt = jest.spyOn(encrypterStub, 'encrypt')

    await sut.sendMail(makeFakeSendMailParams())
    expect(spyEncrypt).toHaveBeenCalledWith(makeFakeAccount().email)
  })

  it('Should throw if Encrypter throws ', async () => {
    const {sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)

    const promise = sut.sendMail(makeFakeSendMailParams())
    expect(promise).rejects.toThrow()
  })

  it('Should calls GenerateUrl with correct values', async () => {
    const { sut, generateUrlStub } = makeSut()
    const spyGenerate = jest.spyOn( generateUrlStub, 'generate')

    await sut.sendMail(makeFakeSendMailParams())
    const params = { route: '/user/check-email/', token: 'any-token'}
    expect(spyGenerate).toHaveBeenCalledWith(params.route, params.token)
  })

  it('Should calls NodemailerSendMail with correct values', async () => {
    const { sut, nodemailerSendMailStub } = makeSut()
    const spySendMail = jest.spyOn( nodemailerSendMailStub, 'sendMail' )

    await sut.sendMail(makeFakeSendMailParams())
    expect(spySendMail).toHaveBeenCalledWith({
      to: 'any@mail.com',
      subject: 'any-subject',
      text: 'any-text: any-adress'
    })
  })

  it('Should throw if NodemailerSendMail throws', async () => {
    const { sut, nodemailerSendMailStub } = makeSut()
    jest.spyOn( nodemailerSendMailStub, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.sendMail(makeFakeSendMailParams())
    await expect(promise).rejects.toThrow()
  })
})