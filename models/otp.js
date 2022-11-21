const mongoose = require("mongoose");
const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    otp: { type: Number },
  },
  {
    collection: "otps",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Otp = mongoose.model("otps", OtpSchema);

module.exports = Otp;
