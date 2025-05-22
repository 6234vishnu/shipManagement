import mongoose from "mongoose";

const CateringOrderSchema = new mongoose.Schema({
  voyager: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyager', required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  status: { type: String, default: 'Pending' }, // or 'Delivered'
  orderedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CateringOrder', CateringOrderSchema);