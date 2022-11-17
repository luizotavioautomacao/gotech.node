import { Validation } from "../../presentation/helpers/validators/validation"
import RequiredFieldValidation from "../../presentation/helpers/validators/required-filed-validation"
import ValidationComposite from "../../presentation/helpers/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"
import ComparteFieldsValidation from "../../presentation/helpers/validators/compare-fileds"
import { EmailValidation } from "../../presentation/helpers/validators/email-validation"
import { EmailValidator } from "../../presentation/protocols"

jest.mock("../../presentation/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidotorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidotorStub()
}

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new ComparteFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})