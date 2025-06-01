import mongoose from "mongoose";

const MovieBookingSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  movieName: String,
  seatNumber: String,
  status:{type:String, default:"Pending"},
  isApproved:{type:Boolean, default:false},
  showTime: Date,
  bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model('MovieBooking', MovieBookingSchema);
