import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { Controller, httpRequest, httpResponse } from '@/presentation/protocols'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogControllerDecorator } from './log'

const makeLogErrorRepository = (): LogErrorRepository => {
    // futuramente criar essa classe de produção no infra-layer
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepositoryStub()
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

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller,
    logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return { sut, controllerStub, logErrorRepositoryStub }
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

    test('Should return the same result of the controller', async () => {

        const { sut } = makeSut()
        const htttRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse: httpResponse = await sut.handle(htttRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: "Luiz Otávio"
            }
        })
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {

        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        const htttRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(htttRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })

})