import { MissingParamError } from "../../../presentation/errors"
import { badRequest, ok, serverError, unauthorized } from "../../../presentation/helpers/http-helper"
import { httpRequest, Authentication, Validation } from "./login-protocols"
import { LoginController } from "./login"

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            return new Promise(resolve => resolve('valid_token'))
        }
    }
    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

interface SutTypes {
    sut: LoginController,
    authenticationStub: Authentication,
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthentication()
    const validationStub = makeValidation()
    const sut = new LoginController(authenticationStub, validationStub)
    return { sut, authenticationStub, validationStub }
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
    // test('Should return 400 if no email is provided', async () => {
    //     const { sut } = makeSut()
    //     const httpResponse = await sut.handle(makeFakeRequest('password'))
    //     expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    // })

    // test('Should return 400 if an invalid email is provided', async () => {
    //     const { sut, emailValidotorStub } = makeSut()
    //     jest.spyOn(emailValidotorStub, 'isValid').mockReturnValueOnce(false)
    //     const httpResponse = await sut.handle(makeFakeRequest())
    //     expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    // })

    // test('Should return 400 if no password is provided', async () => {
    //     const { sut } = makeSut()
    //     const httpResponse = await sut.handle(makeFakeRequest('email'))
    //     expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    // })

    // test('Should call EmailValidator with correct email', async () => {
    //     const { sut, emailValidotorStub } = makeSut()
    //     const isValidSpy = jest.spyOn(emailValidotorStub, 'isValid')
    //     await sut.handle(makeFakeRequest())
    //     expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
    // })

    // test('Should return 500 if EmailValidator throws', async () => {
    //     const { sut, emailValidotorStub } = makeSut()
    //     jest.spyOn(emailValidotorStub, 'isValid').mockImplementationOnce(() => {
    //         throw new Error();
    //     })
    //     const httpResponse = await sut.handle(makeFakeRequest())
    //     expect(httpResponse).toEqual(serverError(new Error()))
    // })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith('valid_email@mail.com', 'valid_password')
    })

    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce((new Promise(resolve => (resolve(null)))))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'valid_token' }))
    })

    test('Should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})