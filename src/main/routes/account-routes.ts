import { Router } from 'express'
import { adapterRouter } from '../adapters/express.routes-adapter'
import { makeSignUpController } from '../factories/signup-factory'


export default (router: Router ): void => {
  router.post('/signup', adapterRouter(makeSignUpController()))
}