const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuForRestaurant,
  getMenuByRestaurantSlug,
} = require("../controllers/menuController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Owner/staff manage menu
router
  .route("/")
  .post(protect, allowRoles("OWNER", "STAFF"), createMenuItem)
  .get(protect, allowRoles("OWNER", "STAFF", "KITCHEN"), getMenuForRestaurant);

// Public menu for QR (no auth)
router.get("/public/:restaurantSlug", getMenuByRestaurantSlug);

module.exports = router;
