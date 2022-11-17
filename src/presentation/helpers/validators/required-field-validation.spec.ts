import { MissingParamError } from '../../errors'
import RequiredFieldValidation from './required-filed-validation'

describe('RequiredField Validation', () => {
    test('Should return a MissingParamError if validation failts', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('field'))
    })

})