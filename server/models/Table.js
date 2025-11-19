const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true }, // e.g. "Table 1"
    slug: { type: String, required: true }, // e.g. "t1" or "table-1"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tableSchema.index({ restaurant: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);
