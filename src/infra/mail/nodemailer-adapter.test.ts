import * as nodemailer from 'nodemailer' 
//import all like this cause have many override
import { NodemailerAdapter } from './nodemailer-adapter'
import { SendMailParams } from '@src/domain/usecases/send-mail'
import { promises } from 'nodemailer/lib/xoauth2'

jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn(async () => {Promise.resolve()}),
  createTransport: jest.fn().mockReturnValue({
     sendMail: jest.fn().mockReturnValue(( mailoptions: any, callback: any ) => {})
   })
}))

const makeMockedNodemailer = (): jest.Mocked<typeof nodemailer> => {
  const mockedNodemailer = nodemailer as jest.Mocked< typeof nodemailer>
  return mockedNodemailer
}

const makeToThrow = (): never => {
  throw new Error()
}

const makeFakeSendMailParams = (): SendMailParams => ({
  to: 'any@mail.com',
  subject: 'Test Verification Email',
  text: 'any-text'
})

interface SutTypes {
  sut: NodemailerAdapter,
  mockedNodemailer: jest.Mocked<typeof nodemailer>
}

const makeSut = (): SutTypes => {
  const mockedNodemailer = makeMockedNodemailer()
  const sut = new NodemailerAdapter(
    'server.mail@mail.com',
    'smtp.ethereal.email',
    'any-user',
    'any-pass',
     1234,
    )
  return {
    sut,
    mockedNodemailer
  }
}

describe('NodemailerAdapter', () => {

  it('Should calls creatTestAccount if subject to be "Test Verification Email"', async () => {
    const { sut, mockedNodemailer } = makeSut()
   // const spyCreateTestAccount = jest.spyOn( mockedNodemailer, 'createTestAccount')
    await sut.sendMail(makeFakeSendMailParams())
    expect(mockedNodemailer.createTestAccount).toBeCalled()
  })
  
  it('Should call createTransport with correct values', async () => {
    const { sut, mockedNodemailer } = makeSut()
    //const spySendMail = jest.spyOn( mockedNodemailer, 'createTransport')

    await sut.sendMail(makeFakeSendMailParams())
    expect(mockedNodemailer.createTransport).toHaveBeenCalledWith(
      {
        host: 'smtp.ethereal.email',
        port: 1234,
        auth: {
          user: 'any-user',
          pass: 'any-pass'
        }
      } 
    )
  })

  it('Shoud call sendMail with correct values', async () => {
    const { sut, mockedNodemailer } = makeSut()
    const spySendMail = jest.spyOn( mockedNodemailer.createTransport(), 'sendMail')
    const params = makeFakeSendMailParams()
    await sut.sendMail(params)
    expect(spySendMail).toHaveBeenCalledWith(
      {
        from: 'server.mail@mail.com',
        ...params
      }
    )
  })

  it('Should throw if sendMail throws', async () => {
    const { sut,  mockedNodemailer } = makeSut()
    jest
    .spyOn( mockedNodemailer.createTransport(), 'sendMail')
    .mockImplementationOnce(makeToThrow) //nao precisa executar
    const promise =  sut.sendMail(makeFakeSendMailParams())
    await expect(promise).rejects.toThrow()
  })
})


