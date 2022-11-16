import { Validation } from "../../presentation/helpers/validators/validation"
import RequiredFieldValidation from "../../presentation/helpers/validators/required-filed-validation"
import ValidationComposite from "../../presentation/helpers/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"
import ComparteFieldsValidation from "../../presentation/helpers/validators/compare-fileds"

jest.mock("../../presentation/helpers/validators/validation-composite")

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new ComparteFieldsValidation('password', 'passwordConfirmation'))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})