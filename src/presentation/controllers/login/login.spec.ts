import { MissingParamError } from "../../../presentation/errors"
import { badRequest } from "../../../presentation/helpers/http-helper"
import { EmailValidator, httpRequest } from "../signup/signup-protocols.index"
import { LoginController } from "./login"

const makeEmailValidator = (): EmailValidator => {
    class EmailValidotorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidotorStub()
}

interface SutTypes {
    sut: LoginController,
    emailValidotorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidotorStub = makeEmailValidator()
    const sut = new LoginController(emailValidotorStub)
    return { sut, emailValidotorStub }
}

const makeFakeRequest = (params?): httpRequest => {
    let body = {}
    switch (params) {
        case 'email':
            Object.assign(body, { email: 'valid_email@mail.com' })
            return { body }
        case 'password':
            Object.assign(body, { password: 'valid_password' })
            return { body }
        default:
            Object.assign(body, { email: 'valid_email@mail.com', password: 'valid_password' })
            return { body }
    }
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

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidotorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidotorStub, 'isValid')
        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')

        // const { sut, emailValidatorSub } = makeSut();
        // jest.spyOn(emailValidatorSub, 'isValid').mockImplementationOnce(() => {
        //     throw new Error()
        // })
        // const httpResponse = await sut.handle(makeFakeRequest())
        // expect(httpResponse).toEqual(serverError())
    })
})