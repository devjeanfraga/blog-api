import {Request, Response, NextFunction} from 'express'


export const cors =  (req: Request, res: Response, next: NextFunction) => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('acess-control-allow-headers', '*')

  next()
}