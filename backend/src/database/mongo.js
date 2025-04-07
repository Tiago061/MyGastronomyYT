import { MongoClient} from 'mongodb'


export const Mongo = {

    // dentro do connect tera a funcao de importacao e exportacao
    async connect({ mongoConnectionString, mongoDbName }) {
        try{
        //Client do banco de dados, essa classe precisa da URL e sera o mongoConnectionString
        const client = new MongoClient(mongoConnectionString)
        

        //conecta o client
        await client.connect()

        //indica qual e o database
        const db = client.db(mongoDbName)

        this.client = client
        this.db = db
        
        return 'Connected to mongo!'
        }catch(error){
            return{ text: 'Error during mongo connection', error}
        }
    }
}