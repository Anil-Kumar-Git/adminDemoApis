const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminTempleteSchema = new Schema(
  {
    key: { type: String },
    TemplateName: {
      type: String,
      default: null,
    },
    bodyTemp:{type : String},
    type: { type: String, enum: ["email", "sms", "push"] },
    user: { type: String, enum: ["user", "admin"] },
    status: { type: Boolean, default: false },
  },
  {
    collection: "adminTemp",
    timestamps: true,
  }
);

const AdminTemplete = mongoose.model(
  "adminTemp",
  AdminTempleteSchema
);

module.exports = AdminTemplete;