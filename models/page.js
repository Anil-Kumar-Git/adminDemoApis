const mongoose = require("mongoose");
const { Schema } = mongoose;

const PageSchema = new Schema(
  {
    title: { type: String },
    type: { type: String, default: 'other'},
    slug: { type: String },
    image: { type: String },
    content: { type: String },
  },
  {
    collection: "pages",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Page = mongoose.model("pages", PageSchema);

module.exports = Page;