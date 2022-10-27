import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest, serverError, unauthorized, ok } from "../../../presentation/helpers/http-helper";
import { Controller, EmailValidator, Authentication, httpRequest, httpResponse } from "./login-protocols.index";

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
            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) return unauthorized();
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}