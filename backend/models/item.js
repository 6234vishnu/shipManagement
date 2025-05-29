import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, 
  type: { type: String, required: true },
  price: Number,
  totalSlots:{ type: String },
  quantity:{ type: String },
  available: { type: Boolean, default: true }
});

export default mongoose.model('Item', ItemSchema);