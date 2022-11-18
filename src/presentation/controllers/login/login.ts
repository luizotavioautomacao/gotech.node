import { badRequest, serverError, unauthorized, ok } from "../../../presentation/helpers/http/http-helper";
import { Controller, Validation, Authentication, httpRequest, httpResponse } from "./login-protocols";

export class LoginController implements Controller {
    private readonly validation
    private readonly authentication

    constructor(authentication: Authentication, validation: Validation) {
        this.validation = validation
        this.authentication = authentication
    }

    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        try {
            const error = this.validation.validate(htttRequest.body)
            if (error) return badRequest(error)
            // const requiredFilds = ['email', 'password']
            // for (const field of requiredFilds) {
            //     if (!htttRequest.body[field]) return badRequest(new MissingParamError(field))
            // }
            const { email, password } = htttRequest.body
            // const isValid = this.emailValidator.isValid(email)
            // if (!isValid) return badRequest(new InvalidParamError('email'))
            const accessToken = await this.authentication.auth({ email, password })
            if (!accessToken) return unauthorized();
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}