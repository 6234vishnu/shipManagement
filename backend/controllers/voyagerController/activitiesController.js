import Item from "../../models/item.js";
import MovieBooking from "../../models/movieBooking.js";
import CateringBooking from "../../models/cateringOrder.js";
import Voyager from '../../models/voyager.js'

export const getMoviesUser = async (req, res) => {
  try {
    const getMovies = await Item.find({ type: "Movies" });
    if (!getMovies)
      res.status(500).json({
        success: false,
        message: "couldint find any Movies try later",
      });
    res.status(200).json({ success: true, movies: getMovies });
  } catch (error) {
    console.log("error in getMovies activities Controller voyager side", error);

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const newMovieBooking = async (req, res) => {
  try {
    const { showDate, showTime, totalSeats, movieName } = req.body;
    if (!showDate || !showTime || !totalSeats || !movieName)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds to book ticket",
      });
    const newBoking = new MovieBooking({
      movieName,
    });

    // it is unfinished
  } catch (error) {
    console.log(
      "error in newMovieBooking activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const getFoodItems = async (req, res) => {
  try {
    const getFoodItems = await Item.find({ category: "Food" });
    if (!getFoodItems)
      return res.status(400).json({
        success: false,
        message: "there is no food items available try later",
      });
    return res.status(200).json({ success: true, items: getFoodItems });
  } catch (error) {
    console.log(
      "error in getFoodItems activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const orderFoodItems = async (req, res) => {

    console.log('body',req.body,req.params);
    
  try {
    const userId = req.params.userId;
    const { items, totalAmount } = req.body;
    if (!items || !totalAmount)
      res
        .status(500)
        .json({ success: false, message: "Server error  try later" });

        const findVoyager=await Voyager.findOne({_id:userId})
        if(!findVoyager)
             res
        .status(400)
        .json({ success: false, message: "Please Login First Before Making Order" });
    const newCatringOrder = new CateringBooking({
      voyager: findVoyager?._id,
      items,
      totalAmount,
    });
    const saveOrder = await newCatringOrder.save();

    if (!saveOrder)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    return res
      .status(200)
      .json({ success: true, message: "order placed successfully" });
  } catch (error) {
    console.log(
      "error in orderFoodItems activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};
