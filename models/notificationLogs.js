const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationLogsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    delete_id: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    title: {
      type: String,
      default: null,
    },
    discription: {
      type: String,
      default: null,
    },
    data: {
      type: Object,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "notificationLogs",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const NotificationLog = mongoose.model(
  "notificationLogs",
  NotificationLogsSchema
);

module.exports = NotificationLog;
