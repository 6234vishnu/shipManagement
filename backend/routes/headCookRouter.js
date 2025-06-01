import express from 'express'
const headCookRouter=express.Router()
import {headCookLogin} from '../controllers/headCookController/authController.js'


headCookRouter.post('/auth/headCook-login',headCookLogin)





export default headCookRouter