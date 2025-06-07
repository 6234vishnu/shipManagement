import express from 'express'
const adminRouter=express.Router()
import { adminLogin,getstaffsUnApproved,getadminDetails,adminLogout } from '../controllers/adminController/authController.js'
import { createCateringItem,getCateringItem,editCateringItem,deleteCateringItem } from '../controllers/adminController/cateringController.js'
import { createfitnessCenterItem,getfitnessCenterItem,editfitnessCenterItem,deletefitnessCenterItem } from '../controllers/adminController/fitnessController.js'
import { createMoviesCenterItem,getMoviesCenterItem,editMoviesCenterItem,deleteMoviesCenterItem } from '../controllers/adminController/moviesController.js'
import { createPartyHallItem,getPartyHallItem,editPartyHallItem,deletePartyHallItem } from '../controllers/adminController/partyHallController.js'
import { createResortListItem,getResortListItem,editResortListItem,deleteResortListItem } from '../controllers/adminController/resortController.js'
import { createStationaryListItem,getStationaryListItem,editStationaryListItem,deleteStationaryListItem } from '../controllers/adminController/stationaryController.js'

adminRouter.post("/auth/login",adminLogin)
adminRouter.post("/auth/logout",adminLogout)
adminRouter.post("/role/getDetails",getadminDetails)
adminRouter.get("/get-Staffs-SignUpRequest",getstaffsUnApproved)


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


adminRouter.post("/resort-additem",createResortListItem)
adminRouter.patch("/resort-edititem",editResortListItem)
adminRouter.delete("/resort-deleteitem/:id",deleteResortListItem)
adminRouter.get("/resort-getItems",getResortListItem)


adminRouter.post("/stationary-additem",createStationaryListItem)
adminRouter.patch("/stationary-edititem",editStationaryListItem)
adminRouter.delete("/stationary-deleteitem/:id",deleteStationaryListItem)
adminRouter.get("/stationary-getItems",getStationaryListItem)





export default adminRouter