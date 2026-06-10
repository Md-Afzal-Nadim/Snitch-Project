import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { googleCallback } from "../controllers/auth.controller.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: false, // bas google auth ke kiya hu false varna true hoga
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }

  },
  fullname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer",
  },

  googleId: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  if(!this.isModified("password")) return;


  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);

export default userModel;
