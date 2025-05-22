import mongoose from "mongoose";

const MovieBookingSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  movieName: String,
  seatNumber: String,
  showTime: Date,
  bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model('MovieBooking', MovieBookingSchema);
