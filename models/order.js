const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    city: { type: String },
    state: { type: String },
    age: { type: String },
    email: { type: String },
    phone: { type: String },
    date_of_request: { type: Date },
    time_of_request: { type: String },
    payment_status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
    tax: { type: Number },
    total: { type: Number },
    processer: { type: String, default: "Stripe" },
    cardType: { type: String, default: "None" },
    processer_fee: { type: String, default: "0" },
    platfrom_fee: { type: String },
    timesearch: { type: Number, default: 1 },
    transaction_id: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    check_delete: { type: String, enum: ["show", "hide"], default: "show" },
  },
  {
    collection: "orders",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;
