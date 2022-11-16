import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, httpRequest, Validation } from './signup-protocols.index'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

interface SutTypes {
    sut: SignUpController,
    emailValidatorSub: EmailValidator,
    addAccountStub: AddAccount,
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const emailValidatorSub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(emailValidatorSub, addAccountStub, validationStub)
    return { sut, emailValidatorSub, addAccountStub, validationStub }
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidotorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidotorStub()
}

const makeAddAccount = (): AddAccount => {
    class addAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new addAccountStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeAccount = (params?): AccountModel => {
    let account = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
    }
    if (!params) return account
    delete account.id
    return account
}

const makeFakeRequest = (params?): httpRequest => {
    let body = {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
    }
    //#region return { body } 
    switch (params) {
        case 'delete_name':
            delete body.name
            return { body }
        case 'delete_email':
            delete body.email
            return { body }
        case 'delete_password':
            delete body.password
            return { body }
        case 'delete_passwordConfirmation':
            delete body.passwordConfirmation
            return { body }
        case 'invalid_password':
            body.password = 'invalid password'
            return { body }
        default:
            return { body }
    }
    //#endregion
}

describe('SignUp Controller', () => {

    test('Should return 400 if no nome is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('delete_name'))
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
        /*  expect(httpResponse.body).toBe(new Error('Missing param: name')) 
                analisa se os ponteiros dos Objetos são iguais x Comparar valores dos objetos
        */
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('delete_email'))
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('delete_password'))
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if passwordConfirmation failed', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('invalid_password'))
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })

    test('Should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest('delete_passwordConfirmation'))
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorSub } = makeSut()
        jest.spyOn(emailValidatorSub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorSub } = makeSut();
        jest.spyOn(emailValidatorSub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError())
    })

    test('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError())
    })

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorSub } = makeSut()
        const isValid = jest.spyOn(emailValidatorSub, 'isValid')
        sut.handle(makeFakeRequest())
        expect(isValid).toHaveBeenCalledWith('valid_email@mail.com')
    })

    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith(makeFakeAccount('any params delete id'))
    })

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
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