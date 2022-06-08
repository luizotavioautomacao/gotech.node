import { Collection, ConnectOptions, MongoClient } from 'mongodb'

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // poolSize: parseInt(process.env.POOL_SIZE!),
    // server: {
    //     poolSize: Number(process.env.POOL_SIZE!)
    // }
} as ConnectOptions;

export const MongoHelper = {
    client: null as MongoClient,

    async connect(url: string): Promise<void> {
        this.client = await MongoClient.connect(url, options)
    },

    async disconnect(): Promise<void> {
        await this.client.close()
    },

    getCollection(name: string): Collection {
        return this.client.db().collection(name)
    },

    changeId: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}