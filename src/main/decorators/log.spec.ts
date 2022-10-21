import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { AccountModel } from '@/domain/models/account'
import { Controller, httpRequest, httpResponse } from '@/presentation/protocols'
import { serverError, ok } from '../../presentation/helpers/http-helper'
import { LogControllerDecorator } from './log'

const makeLogErrorRepository = (): LogErrorRepository => {
    /* futuramente criar essa classe de produção no infra-layer */
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
            return new Promise(resolve => resolve(ok(makeFakeAccount())))
        }
    }
    return new ControllerStub()
}

const makeFakeRequest = (params?): httpRequest => {
    return {
        body: {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password',
            passwordConfirmation: 'valid_password'
        }
    }
}

const makeFakeAccount = (params?): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
    }
}
const makeFakeServerError = (): httpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)

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

    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        await sut.handle(makeFakeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })

    test('Should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpResponse: httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
        await sut.handle(makeFakeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })

})