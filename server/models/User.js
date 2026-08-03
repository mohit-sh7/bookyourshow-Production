import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    image: {
      type: String,
      default: "",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
    type: Boolean,
    default: false,
},

otp: {
    type: String,
    default: null,
},

otpExpiry: {
    type: Date,
    default: null,
},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
