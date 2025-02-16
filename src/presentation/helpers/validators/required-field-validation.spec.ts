import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-filed-validation'

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
    test('Should return a MissingParamError if validation failts', () => {
        const sut = makeSut()
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should not return if validation succeds', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_name' })
        expect(error).toBeFalsy()
    })
})