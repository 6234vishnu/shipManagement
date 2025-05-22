import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    enum: ['admin', 'manager', 'head-cook', 'supervisor'],
    required: true
  }
});

export default mongoose.model('Staff', StaffSchema);

