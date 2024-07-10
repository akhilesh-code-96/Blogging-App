import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
