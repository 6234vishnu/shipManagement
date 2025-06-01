import express from 'express'
const supervisorRouter=express.Router()
import {supervisorLogin} from '../controllers/supervisorController/authController.js'


supervisorRouter.post('/auth/supervisor-login',supervisorLogin)





export default supervisorRouter