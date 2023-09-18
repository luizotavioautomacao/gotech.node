import { MongoHelper as sut } from '../helpers/mongo-helper'
// import { AccountMongoRepository } from './account'

describe('Mongo Helper', () => {

    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    // beforeEach(async () => {
    //     const accountCollection = MongoHelper.getCollection('accounts')
    //     await accountCollection.deleteMany({})
    // })

    // const makeSut = (): AccountMongoRepository => {
    //     return new AccountMongoRepository()
    // }

    test('Should reconnect if mongodb is down', async () => {
        let accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy() // não pode estar nulo
        await sut.disconnect()
        accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy() // não pode estar nulo
    })

})

