import { MissingParamError } from "../../../presentation/errors";
import { badRequest } from "../../../presentation/helpers/http-helper";
import { Controller, httpRequest, httpResponse } from "../signup/signup-protocols.index";

export class LoginController implements Controller {
    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        // return null
    }
}