const express = require("express");
const router = express.Router();
const {
  createStaffUser,
  getStaffUsers,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// All routes here require login
router.use(protect);

// Only OWNER can manage staff users
router.post("/staff", allowRoles("OWNER"), createStaffUser);
router.get("/staff", allowRoles("OWNER"), getStaffUsers);

module.exports = router;
