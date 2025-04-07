import express from 'express'
import cors from 'cors'


//função principal
async function main(){
    
    //o certo é criar um arquivo .env e usar variáveis de ambiente
    //define um endereço que vai rodar a aplicação local
    const hostName = 'localhost'
    //canal de comunicação para o programa se conectar com outros programas ou dispositivos
    const port = 3000

    //Cria um aplicativo
    const app = express()

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
        console.log(`Server running on: http://${hostname}:${port}`)
    })
}


//roda a função
main()