import {Express, Router } from 'express'
import accountRoutes from '../routes/account-routes'


export default ( app: Express): void => {
  const router: Router = Router()
  accountRoutes(router)
  app.use('/api/v1', router)
}