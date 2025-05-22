import mongoose from "mongoose";

const StationeryOrderSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  status: { type: String, default: 'Pending' },
  inspectedBySupervisor: { type: Boolean, default: false },
  orderedAt: { type: Date, default: Date.now }
});

export default mongoose.model('StationeryOrder', StationeryOrderSchema);