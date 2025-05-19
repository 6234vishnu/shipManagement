import express, { Router } from 'express'
import { signUp,enterdOtp } from '../controllers/voyagerController/authController.js'
const voyagerRouter=express.Router()

voyagerRouter.post('/auth/signup',signUp)
voyagerRouter.post('/auth/enterdOtp',enterdOtp)



export default voyagerRouter