import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain text password
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  }
});

const User = mongoose.model("User", userSchema);

export default User;