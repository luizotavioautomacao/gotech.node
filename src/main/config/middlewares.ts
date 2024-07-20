import { Express } from 'express'
import { bodyParser, cors, contentType } from '../middlewares'

export default (app: Express): void => {
    
    app.use(bodyParser)        // app use json() do Express ~ via bodyParserMiddleware
    app.use(cors)              // pode receber request de aplicações de outro servidor
    app.use(contentType)       // por default devemos receber um json
}