const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
    category: { type: String, required: true }, // "Starters", "Main Course"
    price: { type: Number, required: true },
    description: String,
    imageUrl: String,
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, name: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
