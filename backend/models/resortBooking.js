import mongoose from "mongoose";

const ResortBookingSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  viewType: { type: String, enum: ['Oceanview', 'Balcony', 'Corridor', 'Lounge'], required: true },
  resortName: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'Pending' },
  totalAmount:{type:Number,required:true},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ResortBooking', ResortBookingSchema);