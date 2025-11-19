const express = require("express");
const router = express.Router();
const { createTable, getTables } = require("../controllers/tableController");
const { protect} = require("../middlewares/authMiddleware")

const { allowRoles } = require("../middlewares/roleMiddleware");

router.use(protect);

router.post("/", allowRoles("OWNER", "STAFF"), createTable);
router.get("/", allowRoles("OWNER", "STAFF", "KITCHEN"), getTables);

module.exports = router;
