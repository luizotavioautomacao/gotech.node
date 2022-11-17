import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from './validation'
import ValidationComposite from './validation-composite'

const makeSut = (validation): ValidationComposite => {
    return new ValidationComposite([validation])
}

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return new MissingParamError('field')
        }
    }
    return new ValidationStub()
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const validationStub = makeValidationStub()
        const sut = makeSut(validationStub)
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})