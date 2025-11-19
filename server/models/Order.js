const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED", "CANCELLED"],
      default: "PENDING",
    },
    totalAmount: { type: Number, required: true },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // can be null if customer order directly
    },
  },
  { timestamps: true }
);

orderSchema.index({ restaurant: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
