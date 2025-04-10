import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";
import crypto from 'crypto'

const collectionName = 'users'

export default class UsersDataAccess {

    //função assíncrona de buscar usuários
    async getUsers(){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .find({}) //busca todos os dados dentro da tabela users
        .toArray() //transforma em uma lista

        return result
    }
    
    async deleteUser(userId){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .findOneAndDelete({_id: new ObjectId(userId)}) //Busca apenas um usuário e deleta

        return result
    }

    async updateUser(userId, userData){
        if(userData.password){
            const salt = crypto.randomBytes(16)
            
                //funcao de encriptacao
                crypto.pbkdf2(userData.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) =>{
                    if(err) {
                      throw new Error('Error during hashing password')
                    }
                    userData = { ...userData, password: hashedPassword, salt }
                    
                    const result = await Mongo.db
                    .collection(collectionName) //chama a tabela 
                    .findOneAndUpdate(
                        {_id: new ObjectId(userId)},
                        { $set: userData}
                    ) 

                    return result
        })

        } else {
            const result = await Mongo.db
            .collection(collectionName) //chama a tabela 
            .findOneAndUpdate(
                {_id: new ObjectId(userId)},
                { $set: userData}
            ) 

            return result
        }
        

        
    }
}