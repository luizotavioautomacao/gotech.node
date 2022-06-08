import { EmailValidatorAdapter } from './email-validator-adapter'
import validor from 'validator'

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true;
    }
}))

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {

    test('Should return false if validor returns false', async () => {
        const sut = makeSut()
        jest.spyOn(validor, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@mail.com')
        expect(isValid).toBe(false)
    })

    test('Should return true if validor returns true', async () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid_email@mail.com')
        expect(isValid).toBe(true)
    })

    test('Should call validator with correct email', async () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validor, 'isEmail')
        sut.isValid('any_email@mail.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})