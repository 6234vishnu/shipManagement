import mongoose from "mongoose";

const PartyHallBookingSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  partyType: {
    type: String,
    enum: ['Birthday', 'Wedding', 'Engagement', 'Business', 'GetTogether'],
    required: true
  },
  partyHallName:String,
  date: Date,
  time: String,
  status:{type:String, default:"Pending"},
  isApproved:{type:Boolean, default:false},
  price:String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PartyHallBooking', PartyHallBookingSchema);
