
import { MongoHelper } from "../infra/db/mongo-helper";
import app from './config/app'
import * as config from 'config'

MongoHelper.connect(config.get('app.db.url'))
  .then( async () => {
    

    app.listen( config.get('app.port'), () => {
      console.log(`server running at http://localhost: ${config.get('app.port')}`)
    })
  })
  .catch(console.error)
