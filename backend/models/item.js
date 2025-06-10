import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, 
  type: { type: String, required: true },
  equipment:[{ type: String }], 
  price: Number,
  totalSlots:{ type: Number },
  availableSlots: [{ type: Number }],  
  selectedSlots: [{ type: Number }], 
  quantity:{ type: Number },
  available: { type: Boolean, default: true }
});

export default mongoose.model('Item', ItemSchema);