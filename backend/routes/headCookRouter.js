import express from 'express'
const headCookRouter=express.Router()
import {headCookLogin,headCookLogout} from '../controllers/headCookController/authController.js'
import {CateringOrdersLists,updateDeliveryStatus} from '../controllers/headCookController/activitiesController.js'


headCookRouter.post('/auth/headCook-login',headCookLogin)
headCookRouter.post('/auth/logout',headCookLogout)
headCookRouter.get('/headCook-getOrders',CateringOrdersLists)
headCookRouter.patch('/catering-orders/:orderId/deliver',updateDeliveryStatus)





export default headCookRouter