import { Controller, httpRequest, httpResponse } from '@/presentation/protocols'
// import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
// import request from 'supertest'
// import app from '../config/app'
// import env from '../config/env'

import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(htttRequest: httpRequest): Promise<httpResponse> {
            const httpResponse: httpResponse = {
                statusCode: 200,
                body: {
                    name: "Luiz Otávio"
                }
            }
            return new Promise(resolve => resolve(httpResponse))
        }
    }
    return new ControllerStub()
}

const makeSut = (): SutTypes => {

    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return { sut, controllerStub }
}

describe('LogControllerDecorator', () => {

    // beforeAll(async () => {
    //     await MongoHelper.connect(process.env.MONGO_URL)
    // })

    // afterAll(async () => {
    //     await MongoHelper.disconnect()
    // })


    test('Should call controller handle', async () => {

        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const htttRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(htttRequest)
        expect(handleSpy).toHaveBeenCalledWith(htttRequest)
    })

})