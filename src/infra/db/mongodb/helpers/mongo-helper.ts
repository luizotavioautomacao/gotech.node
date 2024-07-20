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
    uri: null as string,

    async connect(uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri, options)
    },

    async disconnect(): Promise<void> {
        await this.client.close()
        this.client = null
    },

    async getCollection(name: string): Promise<Collection> {

        if (!this.client?.connected) {
            await this.connect(this.uri)
        }
        this.client.on('open', _ => { this.client.connected = true })
        this.client.on('topologyClosed', _ => { this.client.connected = false })
        return this.client.db().collection(name)
    },

    changeId: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}