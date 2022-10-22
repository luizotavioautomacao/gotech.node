import { MissingParamError } from "../../../presentation/errors"
import { badRequest } from "../../../presentation/helpers/http-helper"
import { httpRequest } from "../signup/signup-protocols.index"
import { LoginController } from "./login"

const makeFakeRequest = (params?): httpRequest => {
    switch (params) {
        case 'choice':
            return null
    }
    return {
        body: {
            password: 'valid_password'
        }
    }
}

describe('Login controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const sut = new LoginController()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
})