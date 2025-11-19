const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Table = require("../models/Table");
const MenuItem = require("../models/MenuItem");

const createOrderFromQR = async (req, res, next) => {
  try {
    const { restaurantSlug, tableSlug } = req.params;
    const { items, notes } = req.body; 
    // items = [{ menuItemId, quantity }, ...]

    const restaurant = await Restaurant.findOne({ slug: restaurantSlug });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const table = await Table.findOne({
      restaurant: restaurant._id,
      slug: tableSlug,
      isActive: true,
    });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Fetch prices from DB to avoid tampering
    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.menuItemId) },
      restaurant: restaurant._id,
      isAvailable: true,
    });

    let totalAmount = 0;
    const orderItems = items.map((i) => {
      const menuItem = menuItems.find((m) => m._id.toString() === i.menuItemId);
      if (!menuItem) {
        throw new Error("Invalid menu item in order");
      }
      totalAmount += menuItem.price * (i.quantity || 1);
      return {
        menuItem: menuItem._id,
        quantity: i.quantity || 1,
      };
    });

    const order = await Order.create({
      restaurant: restaurant._id,
      table: table._id,
      items: orderItems,
      totalAmount,
      notes,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// for kitchen/admin
const getOrdersForRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;
    const status = req.query.status;

    const filter = { restaurant: restaurantId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("table")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: id, restaurant: restaurantId },
      { status },
      { new: true }
    )
      .populate("table")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrderFromQR,
  getOrdersForRestaurant,
  updateOrderStatus,
};
