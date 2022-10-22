import { MissingParamError } from "../../../presentation/errors"
import { badRequest } from "../../../presentation/helpers/http-helper"
import { httpRequest } from "../signup/signup-protocols.index"
import { LoginController } from "./login"

interface SutTypes {
    sut: LoginController
}

const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return { sut }
}

const makeFakeRequest = (params?): httpRequest => {
    let body = {}
    switch (params) {
        case 'email':
            Object.assign(body, { email: 'valid@mail.com' })
            return { body }
        case 'password':
            Object.assign(body, { password: 'valid_password' })
            return { body }
    }
    return { body }
}

describe('Login controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('password'))
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('email'))
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
})