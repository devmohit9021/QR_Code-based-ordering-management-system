const express = require("express");
const router = express.Router();
const {
  createOrderFromQR,
  getOrdersForRestaurant,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Public: customer placing order from QR
router.post(
  "/public/:restaurantSlug/:tableSlug",
  createOrderFromQR
);

// Authorized: restaurant staff
router.get("/", protect, allowRoles("OWNER", "STAFF", "KITCHEN"), getOrdersForRestaurant);
router.patch("/:id/status", protect, allowRoles("OWNER", "STAFF", "KITCHEN"), updateOrderStatus);

module.exports = router;
