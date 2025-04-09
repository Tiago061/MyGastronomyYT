import express from 'express'
import passport from 'passport'
import localStrategy from 'passport-local'
import crypto from 'crypto'
import { Mongo } from '../database/mongo.js'
import jwt from 'jsonwebtoken'
//bota o id unico no recorde salvo
import  { ObjectId } from 'mongodb'

const collectionName = 'users'

passport.use(new localStrategy({ usernameField: 'email'}, async (email, password, callback) => {
    const user = await  Mongo.db
    .collection(collectionName)
    .findOne({ email: email})

    if(!user){
        return callback(null, false)
    }
        //funcao que salva o usuario com a chave de encriptacao e descriptacao
        const saltBuffer = user.salt.buffer
        //funcao de encriptacao e descriptacao
        crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (error, hashedPassword) => {
            if(error){
                return callback(error)
            }

            //
            const userPasswordBuffer = Buffer.from(user.password.buffer)

            if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)){
                return callback(null, false)
            }

            //desestruturando array
            const { password, salt, ...rest } = user

            return  callback(null, rest) 
        })
}))


//rota
const authRouter = express.Router()

//rota de registrar usuário
authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email })

    if(checkUser){
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: 'User already exists!'
            } 
        })
    }

    //chave de encriptacao
    const salt = crypto.randomBytes(16)

    //funcao de encriptacao
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) =>{
        if(err) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error on crypto password!',
                    err: err
                } 
            })
        }

        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            email: req.body.email,
            password: hashedPassword,
            salt
        })

        if(result.insertedId){
            const user = await Mongo.db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(result.insertedId)})

            const token = jwt.sign(user, 'secret')

            return res.send({
                success: true,
                statusCode: 200,
                body: {
                    text: 'User registered correctly!',
                    token,
                    user,
                    logged: true
                } 
            })
        }
    })
})

//rota de logar
authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', async (error, user, info) => {
        try {
            // Verificação de erros
            if (error) {
                return res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: 'Error during authentication',
                    error: error.message // Mostra apenas a mensagem por segurança
                });
            }

            // Verifica se o usuário existe
            if (!user) {
                return res.status(401).json({ // 401 Unauthorized é mais apropriado
                    success: false,
                    statusCode: 401,
                    message: info.message || 'Authentication failed' // Usa a mensagem do Passport se disponível
                });
            }

            // Gera o token JWT
            const token = jwt.sign(
                { id: user._id, email: user.email }, // Payload seguro
                process.env.JWT_SECRET || 'your-secret-key', // Use variáveis de ambiente!
                { expiresIn: '1h' } // Token expira em 1 hora
            );

            // Resposta de sucesso
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    email: user.email
                    // Não envie dados sensíveis!
                },
                token
            });

        } catch (err) {
            next(err); // Passa erros para o middleware de erro
        }
    })(req, res, next); // Importante: chama a função retornada
});


export default authRouter;