import express from 'express'
import cors from 'cors'
import { Mongo } from './database/mongo.js'
import { config } from 'dotenv'

//para pegar os valores do dotenv
config()

//função principal
async function main(){
    
    //define um endereço que vai rodar a aplicação local
    const hostName = 'localhost'
    //canal de comunicação para o programa se conectar com outros programas ou dispositivos
    const port = 3000

    //Cria um aplicativo
    const app = express()

    //Conecta ao bando de dados
    const mongoConnection = await Mongo.connect({mongoConnectionString: process.env.MONGO_CS, mongoDbName: process.env.MONGO_DB_NAME})
    console.log(mongoConnection)

    //servidor entenda requisições que enviam informações no formato JSON
    app.use(express.json())

    //permite que o servidor aceite requisições de diferentes origens.
    app.use(cors())

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: "Welcome to MyGastronomy"
        })
    })

    app.listen(port, () => {
        console.log(`Server running on: http://${ hostName }:${port}`)
    })
}


//roda a função
main()