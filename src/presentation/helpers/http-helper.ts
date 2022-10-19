import { httpResponse } from '../protocols/http'
import { ServerError } from '../errors'

export const badRequest = (error: Error): httpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}

export const serverError = (error?: Error): httpResponse => {
    return {
        statusCode: 500,
        body: new ServerError(error?.stack)
    }
}

export const ok = (data: any): httpResponse => {
    return {
        statusCode: 200,
        body: data
    }
}

