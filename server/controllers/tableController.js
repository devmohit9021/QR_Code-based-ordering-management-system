const Table = require("../models/Table");
const { slugify } = require("../utils/slug");

const createTable = async (req, res, next) => {
  try {
    const { name } = req.body;
    const restaurantId = req.user.restaurant._id;

    const slug = slugify(name);

    const existing = await Table.findOne({ restaurant: restaurantId, slug });
    if (existing) {
      return res.status(400).json({ message: "Table already exists" });
    }

    const table = await Table.create({
      restaurant: restaurantId,
      name,
      slug,
    });

    res.status(201).json(table);
  } catch (err) {
    next(err);
  }
};

const getTables = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurant._id;
    const tables = await Table.find({ restaurant: restaurantId }).sort("name");
    res.json(tables);
  } catch (err) {
    next(err);
  }
};

module.exports = { createTable, getTables };
