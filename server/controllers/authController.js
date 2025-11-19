const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const { signToken } = require("../utils/jwt");

const registerOwner = async (req, res, next) => {
  try {
    const { name, email, password, restaurantName, restaurantPhone, restaurantAddress } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const restaurant = await Restaurant.create({
      name: restaurantName,
      phone: restaurantPhone,
      address: restaurantAddress,
    });

    const owner = await User.create({
      name,
      email,
      password,
      role: "OWNER",
      restaurant: restaurant._id,
    });

    restaurant.owner = owner._id;
    await restaurant.save();

    const token = signToken({ id: owner._id });

    res.status(201).json({
      user: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        restaurant: restaurant.slug,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("restaurant");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurant: user.restaurant?.slug,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerOwner, login };
