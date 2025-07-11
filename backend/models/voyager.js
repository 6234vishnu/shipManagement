import mongoose from "mongoose";

const VoyagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "voyager" },
});

export default mongoose.model("Voyager", VoyagerSchema);
