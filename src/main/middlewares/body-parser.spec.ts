import * as request from 'supertest'
import app from '@src/main/config/app'

describe('Body-parser Middleware', () => {
  it('Should parser body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ data: 'data-test'})
      .expect({data: 'data-test'})

  })
})