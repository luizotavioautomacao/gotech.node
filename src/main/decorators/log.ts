import { Controller, httpRequest, httpResponse } from '@/presentation/protocols'

// decorator -> design pattern
export class LogControllerDecorator implements Controller {
    private readonly controller: Controller

    constructor(controller: Controller) {
        this.controller = controller;
    }

    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        const httpResponse = await this.controller.handle(htttRequest)
        return null
        if (httpResponse.statusCode === 500) {

        }
        return httpResponse
        return new Promise(resolve => resolve(null))
    }
}