import express from 'express'
import passport from 'passport'
import localStrategy from 'passport-local'
import crypto from 'crypto'
import { Mongo } from '../database/mongo,js'
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
        const saltBuffer = user.salt.saltBuffer
    
        //funcao de encriptacao e descriptacao
        crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
            if(err){
                return callback(null, false)
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
    const salt = crypt.randomBytes(16)

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

export default authRouter;