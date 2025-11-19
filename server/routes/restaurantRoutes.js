const express = require("express");
const router = express.Router();
const {
  getRestaurantProfile,
  updateRestaurant,
} = require("../controllers/RestaurantController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Only owner should manage restaurant details
router.use(protect);
router.get("/profile", allowRoles("OWNER"), getRestaurantProfile);
router.put("/profile", allowRoles("OWNER"), updateRestaurant);

module.exports = router;
