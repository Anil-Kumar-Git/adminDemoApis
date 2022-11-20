const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    profile_image: { type: String, default: null },
    google_login: {
      type: String,
      default: null,
    },
    apple_login: {
      type: String,
      default: null,
    },
    face_id: {
      type: String,
      default: null,
    },
    stripeCustomerId: { type: String, default: null },
    cardId: { type: Object, default: null },

    fcmToken: {
      type: String,
      default: null,
    },
    email: { type: String, default: null },
    mobile_phone: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    mobilePhoneVerified: { type: Boolean, default: false },
    countryCode: { type: String, default: null },
    mobile_without_code: { type: String },
    status: {
      type: String,
      enum: ["active", "suspended", "archived", "mark_for_deletion"],
      default: "active",
    },
    customerType: {
      type: String,
      enum: ["pre", "post"],
      default: "pre",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, default: null },
  },
  {
    collection: "users",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
