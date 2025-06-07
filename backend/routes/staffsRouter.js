import express from 'express'
const staffRouter=express.Router()
import {staffsSignUp,enterdOtpStaffSignUp} from '../controllers/staffsController/authController.js'



staffRouter.post('/auth/signUp',staffsSignUp)
staffRouter.post('/auth/verifyOtp',enterdOtpStaffSignUp)





export default staffRouter