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
            const requiredFilds = ['email', 'password']
            for (const field of requiredFilds) {
                if (!htttRequest.body[field]) return badRequest(new MissingParamError(field))
            }
            const { email, password } = htttRequest.body
            const isValid = this.emailValidator.isValid(email)
            if (!isValid) return badRequest(new InvalidParamError('email'))
            await this.authentication.auth(email, password)
        } catch (error) {
            return serverError(error)
        }
    }
}
//aula 28 - 12 minutos e 11