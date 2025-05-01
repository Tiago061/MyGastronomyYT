import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";


const collectionName = 'plates'

export default class PlatesDataAccess {

    //função assíncrona de buscar usuários
    async getPlates(){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .find({}) //busca todos os dados dentro da tabela Plates
        .toArray() //transforma em uma lista

        return result
    }

    //busca apenas os pratos disponíveis
    async getAvailablePlates(){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .find({ available:  true}) //busca pratos que tem o campo available: true
        .toArray() //transforma em uma lista

        return result
    }

    async addPlate(plateData){
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne(plateData)

        return result
    }
    
    async deletePlate(plateId){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .findOneAndDelete({_id: new ObjectId(plateId)}) //Busca apenas um usuário e deleta

        return result
    }

    async updatePlate(plateId, plateData){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(plateId) },
            { $set: plateData },
        );
        return result

        
    }
}