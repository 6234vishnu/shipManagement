import express from 'express'
const supervisorRouter=express.Router()
import {supervisorLogin,supervisorLogout} from '../controllers/supervisorController/authController.js'
import {superviorStationaryList,updateDeliveryStatus} from '../controllers/supervisorController/activitiesController.js'


supervisorRouter.post('/auth/supervisor-login',supervisorLogin)
supervisorRouter.post('/auth/logout',supervisorLogout)
supervisorRouter.get('/stationary-orders',superviorStationaryList)
supervisorRouter.patch('/stationary-orders/:orderId/deliver',updateDeliveryStatus)




export default supervisorRouter