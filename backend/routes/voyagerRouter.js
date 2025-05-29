import express, { Router } from 'express'
import { signUp,enterdOtp } from '../controllers/voyagerController/authController.js'
import { getMoviesUser,newMovieBooking,getFoodItems,orderFoodItems } from '../controllers/voyagerController/activitiesController.js'
const voyagerRouter=express.Router()

voyagerRouter.post('/auth/signup',signUp)
voyagerRouter.post('/auth/enterdOtp',enterdOtp)

voyagerRouter.get('/get-Movies-List',getMoviesUser)
voyagerRouter.post('/add-New-Booking',newMovieBooking)
voyagerRouter.get('/get-FoodItems',getFoodItems)
voyagerRouter.post('/catering-orderBooking/:userId',orderFoodItems)



export default voyagerRouter