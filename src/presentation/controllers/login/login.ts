import { MissingParamError } from "../../../presentation/errors";
import { badRequest } from "../../../presentation/helpers/http-helper";
import { Controller, EmailValidator, httpRequest, httpResponse } from "../signup/signup-protocols.index";

export class LoginController implements Controller {
    private readonly emailValidator
    constructor(emailValidator: EmailValidator) { this.emailValidator = emailValidator }
    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        if (!htttRequest.body.email) {
            return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        }
        if (!htttRequest.body.password) {
            return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
        }
        this.emailValidator.isValid(htttRequest.body.email)
    }
}