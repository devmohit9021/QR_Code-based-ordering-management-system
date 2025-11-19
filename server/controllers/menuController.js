const MenuItem = require("../models/MenuItem");

const createMenuItem = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;
    const { name, category, price, description, imageUrl } = req.body;

    const item = await MenuItem.create({
      restaurant: restaurantId,
      name,
      category,
      price,
      description,
      imageUrl,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const getMenuForRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;
    const items = await MenuItem.find({
      restaurant: restaurantId,
      isAvailable: true,
    }).sort({ category: 1, name: 1 });

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// public menu via slug (for QR)
const getMenuByRestaurantSlug = async (req, res, next) => {
  try {
    const restaurantSlug = req.params.restaurantSlug;
    const Restaurant = require("../models/Restaurant");

    const restaurant = await Restaurant.findOne({ slug: restaurantSlug });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const items = await MenuItem.find({
      restaurant: restaurant._id,
      isAvailable: true,
    }).sort({ category: 1, name: 1 });

    res.json({ restaurant: restaurant.name, items });
  } catch (err) {
    next(err);
  }
};

module.exports = { createMenuItem, getMenuForRestaurant, getMenuByRestaurantSlug };
