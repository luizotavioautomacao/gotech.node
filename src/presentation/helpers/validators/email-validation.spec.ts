import { InvalidParamError } from '../../../presentation/errors'
import { EmailValidator } from '../../protocols/email-validator'
import { serverError } from '../http-helper'
import { EmailValidation } from './email-validation'

interface SutTypes {
    sut: EmailValidation,
    emailValidatorSub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorSub = makeEmailValidator()
    const sut = new EmailValidation('email', emailValidatorSub)
    return { sut, emailValidatorSub }
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidotorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidotorStub()
}

describe('Email Validation', () => {
    test('Should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorSub } = makeSut()
        jest.spyOn(emailValidatorSub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'any_email@mail.com' })
        expect(error).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorSub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorSub, 'isValid')
        sut.validate({ email: 'valid_email@mail.com' })
        expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })

    test('Should throw if EmailValidator throws', () => {
        const { sut, emailValidatorSub } = makeSut();
        jest.spyOn(emailValidatorSub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})