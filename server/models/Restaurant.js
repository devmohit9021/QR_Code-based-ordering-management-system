const mongoose = require("mongoose");
const { slugify } = require("../utils/slug");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    address: String,
    phone: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

restaurantSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name) + "-" + Date.now().toString().slice(-4);
  }
  next();
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
