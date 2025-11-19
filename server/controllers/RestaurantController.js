const Restaurant = require("../models/Restaurant");

const getRestaurantProfile = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.user.restaurant._id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

const updateRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;
    const { name, address, phone } = req.body;

    const updated = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { name, address, phone },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRestaurantProfile,
  updateRestaurant,
};
