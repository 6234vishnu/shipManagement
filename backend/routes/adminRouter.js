import express from 'express'
import { adminLogin } from '../controllers/adminController/authController.js'
const adminRouter=express.Router()

adminRouter.post("/auth/login",adminLogin)



export default adminRouter