import { httpRequest, httpResponse, Controller, EmailValidator, AddAccount, Validation } from "./signup-protocols.index"
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount
    private readonly validation: Validation

        constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation?: Validation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        try {
            this.validation.validate(htttRequest.body)
            const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFilds) {
                if (!htttRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const { name, email, password, passwordConfirmation } = htttRequest.body;
            if (password != passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))
            const isValid = this.emailValidator.isValid(email)
            if (!isValid) return badRequest(new InvalidParamError('email'))
            const account = await this.addAccount.add({ name, email, password })
            return ok(account)
        }
        catch (error) {
            return serverError(error)
        }

    }
}