const mongoose = require("mongoose");
const { Schema } = mongoose;

// type: String,
// enum: ["active", "suspended", "archived"],
// default: "active",
const AdminNotificationSchema = new Schema(
  {
    key: { type: String },
    text: { type: String },
    sgTemplateId: {
      type: String,
      default: null,
    },
    sgTemplateName: {
      type: String,
      default: null,
    },
    type: { type: String, enum: ["email", "sms", "push"] },
    user: { type: String, enum: ["user", "admin"] },
    status: { type: Boolean, default: false },
  },
  {
    collection: "adminNotification",
    timestamps: true,
  }
);

const AdminNotification = mongoose.model(
  "adminNotification",
  AdminNotificationSchema
);

module.exports = AdminNotification;
