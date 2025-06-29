import mongoose from "mongoose";

const CateringOrderSchema = new mongoose.Schema({
  voyager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voyager",
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // or 'Delivered'
  orderedAt: { type: Date, default: Date.now },
});

export default mongoose.model("CateringOrder", CateringOrderSchema);
