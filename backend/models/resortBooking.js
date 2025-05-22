import mongoose from "mongoose";

const ResortBookingSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  viewType: { type: String, enum: ['Oceanview', 'Balcony', 'Corridor', 'Lounge'], required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ResortBooking', ResortBookingSchema);