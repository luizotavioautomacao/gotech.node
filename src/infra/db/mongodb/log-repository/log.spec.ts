import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { LogMongoRepository } from "./log"

describe('LogMongoRepository Usecaser', () => {
    let collection: Collection

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        collection = await MongoHelper.getCollection('errors') // errorsCollection
        await collection.deleteMany({})
    })

    test('Should create an error log on sucess', async () => {
        const sut = new LogMongoRepository()
        await sut.logError('any_error')
        const count = await collection.countDocuments()      
        expect(count).toBe(1)
    })

})