import express from 'express'
import { adminLogin,createCateringItem,getCateringItem,editCateringItem,deleteCateringItem } from '../controllers/adminController/authController.js'
const adminRouter=express.Router()

adminRouter.post("/auth/login",adminLogin)



adminRouter.post("/catering-additem",createCateringItem)
adminRouter.patch("/catering-edititem",editCateringItem)
adminRouter.delete("/catering-deleteitem/:id",deleteCateringItem)
adminRouter.get("/catering-getItems",getCateringItem)



export default adminRouter