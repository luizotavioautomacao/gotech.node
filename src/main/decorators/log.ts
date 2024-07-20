import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { Controller, httpRequest, httpResponse } from '../../presentation/protocols'

// decorator -> design pattern
export class LogControllerDecorator implements Controller {
    private readonly controller: Controller
    private readonly logErrorRepository: LogErrorRepository

    constructor(controller: Controller, logErrorRepository?: LogErrorRepository) {
        this.controller = controller
        this.logErrorRepository = logErrorRepository
    }

    async handle(htttRequest: httpRequest): Promise<httpResponse> {
        const httpResponse = await this.controller.handle(htttRequest)
        if (httpResponse.statusCode === 500) await this.logErrorRepository.logError(httpResponse.body.stack)
        return httpResponse
    }
}
