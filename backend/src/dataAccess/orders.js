import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";


const collectionName = 'orders'

export default class OrdersDataAccess {

    //função assíncrona de buscar usuários
    async getOrders(){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .aggregate([
            {
               $lookup: {
                from: 'orderItems',
                localField: '_id',
                foreignField: 'orderId',
                as: 'orderItems'
               }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
               },
               {
                //essa função faz com que as credenciais não apareça para o usuário como (dados sensíveis)
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0,
                }
               },
               {
                $unwind: '$orderItems'
               },
               {
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
               },
        ]) //busca todos os dados dentro da tabela Orders
        .toArray() //transforma em uma lista

        return result
    }


    async addOrder(orderData){
        const { items, ...orderDataRest } = orderData

        orderDataRest.createdAt = new Date()
        orderDataRest.pickupStatus = 'Pending'
        orderDataRest.userId = new ObjectId(orderDataRest.userId)
        
        const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest)

        if(!newOrder.insertedId){
            throw new Error('Order cannot be inserted')
        }

        items.map((item) => {
            item.plateId = new ObjectId(item.plateId)
            item.orderId = new ObjectId(newOrder.insertedId)
        })

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items)

        return result
    }
    
    async deleteOrder(orderId){
        const result = await Mongo.db
        .collection(collectionName) //chama a tabela 
        .findOneAndDelete({_id: new ObjectId(orderId)}) //Busca apenas um usuário e deleta

        return result
    }

    async updateOrder(orderId, orderData){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: orderData },
        );
        return result

        
    }
}