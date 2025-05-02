import express from 'express'
import OrdersControllers from '../controllers/orders.js'





const ordersRouter = express.Router()

const ordersController = new OrdersControllers()

ordersRouter.get('/', async(req, res) => {
        const { success, statusCode, body } = await ordersController.getOrders()
    
        res.status(statusCode).json({ success, statusCode, body });
})

ordersRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await ordersController.addOrder(req.body)

    res.status(statusCode).send( { success, statusCode, body })
})

ordersRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await ordersController.deleteOrdersControllers(req.params.id)

    res.status(statusCode).send( { success, statusCode, body })
})

ordersRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await ordersController.updateOrdersControllers(req.params.id, req.body)
    
    res.status(statusCode).send( { success, statusCode, body })
})


export default ordersRouter