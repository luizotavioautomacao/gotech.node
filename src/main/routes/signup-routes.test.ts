import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

describe('SignUp Routes', () => {

    beforeAll(async () => {      
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })


    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Luiz Otávio',
                email: 'luizotavioautomacao@gmail.com',
                password: 'password_123',
                passwordConfirmation: 'password_123'
            })
            .expect(200)
    })

})