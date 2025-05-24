import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // e.g. Food, Beverage, Gift, Book
  type: { type: String, required: true },
  price: Number,
  available: { type: Boolean, default: true }
});

export default mongoose.model('Item', ItemSchema);