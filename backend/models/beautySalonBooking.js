import mongoose from "mongoose";

const BeautySalonBookingSchema = new mongoose.Schema({
  voyager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voyager",
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["Haircut", "Facial", "Makeup", "spa", "Bridal package"],
    required: true,
  },
  beautySalonName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Pending" },
  isApproved: { type: Boolean, default: false },
  price: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("BeautySalonBooking", BeautySalonBookingSchema);
