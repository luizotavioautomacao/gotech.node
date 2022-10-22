import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest, serverError } from "../../../presentation/helpers/http-helper";
import { Controller, EmailValidator, httpRequest, httpResponse } from "../signup/signup-protocols.index";

export class LoginController implements Controller {
    private readonly emailValidator
    constructor(emailValidator: EmailValidator) { this.emailValidator = emailValidator }
    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        try {

            const { email, password } = htttRequest.body
            if (!email) {
                return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
            }
            if (!password) {
                return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
            }
            const insValid = this.emailValidator.isValid(email)
            if (!insValid) return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
        } catch (error) {
            return serverError(error)
        }
    }
}