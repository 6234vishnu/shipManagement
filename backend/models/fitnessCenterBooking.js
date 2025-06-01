import mongoose from "mongoose";

const FitnessBookingSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  GymName:String,
  timeSlot: String,
  date: Date,
  price:Number,
  status:{type:String, default:"Pending"},
  isApproved:{type:Boolean, default:false},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FitnessBooking', FitnessBookingSchema);
