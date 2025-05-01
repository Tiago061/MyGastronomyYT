import express from 'express'
import PlatesControllers from '../controllers/plates.js';




const platesRouter = express.Router()

const platesController = new PlatesControllers()

platesRouter.get('/', async(req, res) => {
        const { success, statusCode, body } = await platesController.getPlates()
    
        res.status(statusCode).json({ success, statusCode, body });
})

platesRouter.get('/availables/', async(req, res) => {
    const { success, statusCode, body } = await platesController.getAvailablePlates()
    
    res.status(statusCode).send( { success, statusCode, body })
})

platesRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await platesController.addPlate(req.body)

    res.status(statusCode).send( { success, statusCode, body })
})

platesRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await platesController.deletePlate(req.params.id)

    res.status(statusCode).send( { success, statusCode, body })
})

platesRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await platesController.updatePlate(req.params.id, req.body)
    
    res.status(statusCode).send( { success, statusCode, body })
})


export default platesRouter