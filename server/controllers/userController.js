const User = require("../models/User");

const createStaffUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow STAFF or KITCHEN roles to be created here
    if (!["STAFF", "KITCHEN"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Allowed: STAFF, KITCHEN",
      });
    }

    // Staff must belong to same restaurant as owner
    const restaurantId = req.user.restaurant._id;

    // Check if email already used
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const staffUser = await User.create({
      name,
      email,
      password,
      role,
      restaurant: restaurantId,
    });

    res.status(201).json({
      id: staffUser._id,
      name: staffUser.name,
      email: staffUser.email,
      role: staffUser.role,
    });
  } catch (err) {
    next(err);
  }
};

const getStaffUsers = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;

    const staff = await User.find({
      restaurant: restaurantId,
      role: { $ne: "OWNER" }, // all non-owner users
    }).select("-password"); // don't send password

    res.json(staff);
  } catch (err) {
    next(err);
  }
};

module.exports = { createStaffUser, getStaffUsers };
