const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserNotificationSchema = new Schema(
  {
    email: { type: Boolean },
    sms: { type: Boolean },
    push_notification: { type: Boolean },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    collection: "userNotification",
    timestamps: true,
  }
);

const UserNotification = mongoose.model("userNotification", UserNotificationSchema);

module.exports = UserNotification;