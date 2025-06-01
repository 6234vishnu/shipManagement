import express from 'express'
const managerRouter=express.Router()
import {managerLogin,} from '../controllers/managerController/authController.js'
import {managerDashboardData,managerUpdateBookingsStatus} from '../controllers/managerController/activitiesController.js'


managerRouter.post('/auth/manager-login',managerLogin)
managerRouter.get('/get-manager-dashboardData',managerDashboardData)
managerRouter.post('/status-Update',managerUpdateBookingsStatus)





export default managerRouter