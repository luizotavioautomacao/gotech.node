import { httpRequest, httpResponse } from "./http";

export interface Controller {
    handle(htttRequest: httpRequest): Promise<httpResponse>
}