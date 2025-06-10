import Item from "../../models/item.js";
import MovieBooking from "../../models/movieBooking.js";
import CateringBooking from "../../models/cateringOrder.js";
import StationaryBooking from "../../models/statinaryOrder.js";
import Voyager from "../../models/voyager.js";
import ResortBooking from "../../models/resortBooking.js";
import FitnessCenter from "../../models/fitnessCenterBooking.js";
import PartyHall from "../../models/partyHallBooking.js";

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
    // Validate required fields
    const { showDate, showTime, totalSeats, movieName } = req.body;
    const { voyagerId } = req.query;
    
    if (!showDate || !showTime || !totalSeats || !movieName || !voyagerId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to book a ticket",
      });
    }

    // Validate totalSeats is a positive number
    if (isNaN(totalSeats) || parseInt(totalSeats) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total seats must be a positive number",
      });
    }

    // Check movie availability
    const movie = await Item.findOne({ type: "Movies", name: movieName });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Check available seats
    if (movie.totalSlots < parseInt(totalSeats)) {
      return res.status(400).json({
        success: false,
        message: "Not enough available seats",
        availableSeats: movie.totalSlots
      });
    }

    // Create new booking
    const newBooking = new MovieBooking({
      voyager: voyagerId,
      movieName,
      totalSeats: parseInt(totalSeats),
      status: "Booked",
      bookedAt: showDate,
      showTime,
    });

    // Save booking
    const savedBooking = await newBooking.save();
    if (!savedBooking) {
      return res.status(500).json({
        success: false,
        message: "Failed to save booking",
      });
    }

    // Update available slots
    const updatedMovie = await Item.updateOne(
      { type: "Movies", name: movieName },
      { $inc: { totalSlots: -parseInt(totalSeats) } }
    );
    
    if (!updatedMovie.modifiedCount) {
      // Rollback the booking if slot update fails
      await MovieBooking.deleteOne({ _id: savedBooking._id });
      return res.status(500).json({
        success: false,
        message: "Failed to update movie availability",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking successful",
      bookingId: savedBooking._id,
      movieName,
      totalSeats,
      showDate,
      showTime
    });

  } catch (error) {
    console.error("Error in newMovieBooking controller:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getFoodItems = async (req, res) => {
  try {
    const getFoodItems = await Item.find({
      category: "Food",
      quantity: { $gt: 0 },
    });
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
  try {
    const userId = req.params.userId;
    const { items, totalAmount } = req.body;

    if (!items || !totalAmount)
      return res
        .status(500)
        .json({ success: false, message: "Server error, try later" });

    const findVoyager = await Voyager.findById(userId);
    if (!findVoyager)
      return res.status(400).json({
        success: false,
        message: "Please login first before making order",
      });

    const newCateringOrder = new CateringBooking({
      voyager: findVoyager._id,
      items,
      totalAmount,
    });

    const saveOrder = await newCateringOrder.save();
    if (!saveOrder)
      return res
        .status(500)
        .json({ success: false, message: "Server error, try later" });

    for (const item of items) {
      const currentItem = await Item.findById(item.itemId);
      const itemQty = Number(item.quantity);

      if (!currentItem || currentItem.quantity < itemQty) {
        throw new Error("Insufficient stock for item: " + item.itemId);
      }

      const updateItem = await Item.findByIdAndUpdate(
        item.itemId,
        { $inc: { quantity: -itemQty } },
        { new: true }
      );

      if (!updateItem)
        return res
          .status(500)
          .json({ success: false, message: error.message || "Server error" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(
      "error in orderFoodItems activities Controller voyager side",
      error
    );

    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const getStationaryItems = async (req, res) => {
  try {
    const getStationaryItems = await Item.find({ type: "stationary" });
    if (!getFoodItems)
      return res.status(400).json({
        success: false,
        message: "there is no stationary items available try later",
      });
    return res.status(200).json({ success: true, items: getStationaryItems });
  } catch (error) {
    console.log(
      "error in getStationaryItems activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const orderStationaryItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { items, totalAmount } = req.body;
    if (!items || !totalAmount)
      res
        .status(500)
        .json({ success: false, message: "Server error  try later" });

    const findVoyager = await Voyager.findOne({ _id: userId });
    if (!findVoyager)
      res.status(400).json({
        success: false,
        message: "Please Login First Before Making Order",
      });
    const newStationaryOrder = new StationaryBooking({
      voyager: findVoyager?._id,
      items,
      totalAmount,
    });
    const saveOrder = await newStationaryOrder.save();

    if (!saveOrder)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    for (const item of items) {
      const currentItem = await Item.findById(item.itemId);
      const itemQty = Number(item.quantity);

      if (!currentItem || currentItem.quantity < itemQty) {
        throw new Error("Insufficient stock for item: " + item.itemId);
      }

      const updateItem = await Item.findByIdAndUpdate(
        item.itemId,
        { $inc: { quantity: -itemQty } },
        { new: true }
      );

      if (!updateItem)
        return res
          .status(500)
          .json({ success: false, message: error.message || "Server error" });
    }

    return res
      .status(200)
      .json({ success: true, message: "order placed successfully" });
  } catch (error) {
    console.log(
      "error in orderStationaryItems activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const getResorts = async (req, res) => {
  try {
    const getStationaryItems = await Item.find({ type: "resort" });
    if (!getFoodItems)
      return res.status(400).json({
        success: false,
        message: "there is no resort items available try later",
      });
    return res.status(200).json({ success: true, items: getStationaryItems });
  } catch (error) {
    console.log(
      "error in getResorts activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const BookResort = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { viewType, date, resortName, totalAmount } = req.body;
    if (!viewType || !date || !totalAmount || !resortName)
      res
        .status(500)
        .json({ success: false, message: "Server error  try later" });

    const findVoyager = await Voyager.findOne({ _id: userId });
    if (!findVoyager)
      res.status(400).json({
        success: false,
        message: "Please Login First Before Making Order",
      });
    const newResortBooking = new ResortBooking({
      voyager: findVoyager?._id,
      viewType,
      resortName,
      date,
      totalAmount,
    });
    const saveBooking = await newResortBooking.save();

    if (!saveBooking)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    const updateavailableRoomsInResort = await Item.updateOne(
      { type: "resort", name: resortName },
      { $inc: { totalSlots: -1 } }
    );

    if (!updateavailableRoomsInResort)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    return res
      .status(200)
      .json({ success: true, message: "Resort Booked successfully" });
  } catch (error) {
    console.log(
      "error in BookResort activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const getFitnessData = async (req, res) => {
  try {
    const getFitnessItems = await Item.find({ type: "Gym" });
    if (!getFoodItems)
      return res.status(400).json({
        success: false,
        message: "there is no fitness Equipments  available try later",
      });
    return res.status(200).json({ success: true, items: getFitnessItems });
  } catch (error) {
    console.log(
      "error in getFitnessData activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const BookingGym = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { date, timeSlot, GymName, price } = req.body;
    if (!timeSlot || !date || !GymName || !price)
      res
        .status(500)
        .json({ success: false, message: "Server error  try later" });

    const findVoyager = await Voyager.findOne({ _id: userId });
    if (!findVoyager)
      res.status(400).json({
        success: false,
        message: "Please Login First Before Making Order",
      });
    const newGymBooking = new FitnessCenter({
      voyager: findVoyager?._id,
      GymName,
      timeSlot,
      price,
      date,
    });
    const saveBooking = await newGymBooking.save();

    if (!saveBooking)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    const updateavailablegyms = await Item.updateOne(
      { type: "Gym", name: GymName },
      { $inc: { totalSlots: -1 } }
    );

    if (!updateavailablegyms)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    return res
      .status(200)
      .json({ success: true, message: "Gym Booked successfully" });
  } catch (error) {
    console.log(
      "error in BookingGym activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const getPartyHallList = async (req, res) => {
  try {
    const getPartyHallsItems = await Item.find({ type: "partyHall" });
    if (!getFoodItems)
      return res.status(400).json({
        success: false,
        message: "there is no Party Halls  available try later",
      });
    return res.status(200).json({ success: true, items: getPartyHallsItems });
  } catch (error) {
    console.log(
      "error in getPartyHallList activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};

export const BookingPartyHall = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { date, time, partyHallName, price, partyType } = req.body;
    if (!time || !date || !partyHallName || !price || !partyType)
      res
        .status(500)
        .json({ success: false, message: "Server error  try later" });

    const findVoyager = await Voyager.findOne({ _id: userId });
    if (!findVoyager)
      res.status(400).json({
        success: false,
        message: "Please Login First Before Making Booking",
      });
    const newPartyHallBooking = new PartyHall({
      voyager: findVoyager?._id,
      partyHallName,
      partyType,
      time,
      price,
      date,
    });
    const saveBooking = await newPartyHallBooking.save();

    if (!saveBooking)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    const updateavailablepartyHalls = await Item.updateOne(
      { type: "partyHall", name: partyHallName },
      { $inc: { totalSlots: -1 } }
    );

    if (!updateavailablepartyHalls)
      res
        .status(500)
        .json({ success: false, message: "server error  try later" });

    return res
      .status(200)
      .json({ success: true, message: "Party Hall Booked successfully" });
  } catch (error) {
    console.log(
      "error in BookingPartyHall activities Controller voyager side",
      error
    );

    res
      .status(500)
      .json({ success: false, message: "server error  try later" });
  }
};
