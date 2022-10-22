import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest, serverError } from "../../../presentation/helpers/http-helper";
import { Controller, EmailValidator, httpRequest, httpResponse } from "../signup/signup-protocols.index";

export class LoginController implements Controller {
    private readonly emailValidator
    private readonly authentication

    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

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
            await this.authentication.auth(email, password)
        } catch (error) {
            return serverError(error)
        }
    }
}