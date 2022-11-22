const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    price: { type: String },
    status: { type: Boolean, default: false },
    benefit: { type: String },
  },
  {
    collection: "services",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Service = mongoose.model("services", ServiceSchema);

module.exports = Service;
