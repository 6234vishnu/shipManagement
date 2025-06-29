import mongoose from "mongoose";

const MovieBookingSchema = new mongoose.Schema({
  voyager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voyager",
    required: true,
  },
  movieName: String,
  totalSeats: String,
  status: { type: String, default: "Pending" },
  isApproved: { type: Boolean, default: false },
  showTime: { type: String },
  bookedAt: { type: Date, default: Date.now },
});

export default mongoose.model("MovieBooking", MovieBookingSchema);
