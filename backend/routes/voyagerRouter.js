import express, { Router } from "express";
import {
  signUp,
  enterdOtp,
  getVoyagerDetails,
  voyagerLogout,
  voyagerLogin,
  forgotPasswordGetOtp,
  saveNewPassword,
} from "../controllers/voyagerController/authController.js";
import {
  getMoviesUser,
  newMovieBooking,
  getFoodItems,
  orderFoodItems,
  getStationaryItems,
  orderStationaryItems,
  BookResort,
  getResorts,
  getFitnessData,
  BookingGym,
  getPartyHallList,
  BookingPartyHall,
} from "../controllers/voyagerController/activitiesController.js";
const voyagerRouter = express.Router();

voyagerRouter.post("/auth/signup", signUp);
voyagerRouter.post("/auth/login", voyagerLogin);
voyagerRouter.post("/auth/enterdOtp", enterdOtp);
voyagerRouter.post("/auth/getDetails", getVoyagerDetails);
voyagerRouter.post("/auth/logout", voyagerLogout);
voyagerRouter.post("/auth/forgotPassword-getOtp", forgotPasswordGetOtp);
voyagerRouter.post("/auth/forgotPassword-changePassword", saveNewPassword);

voyagerRouter.get("/get-Movies-List", getMoviesUser);
voyagerRouter.post("/add-New-Booking", newMovieBooking);

voyagerRouter.get("/get-FoodItems", getFoodItems);
voyagerRouter.post("/catering-orderBooking/:userId", orderFoodItems);

voyagerRouter.get("/get-StationaryItems", getStationaryItems);
voyagerRouter.post("/stationary-orderBooking/:userId", orderStationaryItems);

voyagerRouter.get("/get-Resort", getResorts);
voyagerRouter.post("/resort-booking/:userId", BookResort);

voyagerRouter.get("/get-fitness-equipment", getFitnessData);
voyagerRouter.post("/fitness-booking/:userId", BookingGym);

voyagerRouter.get("/get-party-halls", getPartyHallList);
voyagerRouter.post("/party-hall-booking/:userId", BookingPartyHall);

export default voyagerRouter;
