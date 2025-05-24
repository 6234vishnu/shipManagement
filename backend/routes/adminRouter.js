import express from 'express'
const adminRouter=express.Router()
import { adminLogin, } from '../controllers/adminController/authController.js'
import { createCateringItem,getCateringItem,editCateringItem,deleteCateringItem } from '../controllers/adminController/categoryController.js'
import { createfitnessCenterItem,getfitnessCenterItem,editfitnessCenterItem,deletefitnessCenterItem } from '../controllers/adminController/fitnessController.js'
import { createMoviesCenterItem,getMoviesCenterItem,editMoviesCenterItem,deleteMoviesCenterItem } from '../controllers/adminController/moviesController.js'
import { createPartyHallItem,getPartyHallItem,editPartyHallItem,deletePartyHallItem } from '../controllers/adminController/partyHallController.js'

adminRouter.post("/auth/login",adminLogin)



adminRouter.post("/catering-additem",createCateringItem)
adminRouter.patch("/catering-edititem",editCateringItem)
adminRouter.delete("/catering-deleteitem/:id",deleteCateringItem)
adminRouter.get("/catering-getItems",getCateringItem)

adminRouter.post("/fitnessCenter-additem",createfitnessCenterItem)
adminRouter.patch("/fitnessCenter-edititem",editfitnessCenterItem)
adminRouter.delete("/fitnessCenter-deleteitem/:id",deletefitnessCenterItem)
adminRouter.get("/fitnessCenter-getItems",getfitnessCenterItem)


adminRouter.post("/movies-additem",createMoviesCenterItem)
adminRouter.patch("/movies-edititem",editMoviesCenterItem)
adminRouter.delete("/movies-deleteitem/:id",deleteMoviesCenterItem)
adminRouter.get("/movies-getItems",getMoviesCenterItem)


adminRouter.post("/partyHall-additem",createPartyHallItem)
adminRouter.patch("/partyHall-edititem",editPartyHallItem)
adminRouter.delete("/partyHall-deleteitem/:id",deletePartyHallItem)
adminRouter.get("/partyHall-getItems",getPartyHallItem)





export default adminRouter