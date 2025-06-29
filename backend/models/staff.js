import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "manager", "head-cook", "supervisor"],
      required: true,
    },
    isSignUpAccepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Staff", StaffSchema);
