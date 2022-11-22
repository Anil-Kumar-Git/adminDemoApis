const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderDetailsSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: "orders" },
    service_id: { type: Schema.Types.ObjectId, ref: "services" },
    result: {
      anti_cash: {
        last_name:  {
          type: String,
          enum: ["match", "partial", "no_match"],
        },
        first_name: {
          type: String,
          enum: ["match", "partial", "no_match"],
        },
        city: {
          type: String,
          enum: ["match", "partial", "no_match"],
        },
        state:  {
          type: String,
          enum: ["match", "partial", "no_match"],
        },
        yob:  {
          type: String,
          enum: ["match", "partial", "no_match"],
        },
        marital_status:  {
          type: String,
          enum: ["match", "partial", "no_match"],
        }
      },
      criminal: {
        Status: Boolean,
        City: String,
        County: String,
        CourtRoom:String,
        DefendantName: String,
        FileNumber: String,
        OffenseDescription: String,
        OffenseNumber: String,
        OffenseStatus: String,
        OffenseType: String,
        TrialDate: String,
        DOB: String,
      },
      social: {
        name: String,
        status: String,
        discription: String,
      },
    },
    status: {
      type: String,
      enum: ["verified", "partial", "no_match", "pending"],
      default: "pending",
    },
  },
  {
    collection: "order_details",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const OrderCheck = mongoose.model("order_details", OrderDetailsSchema);

module.exports = OrderCheck;
