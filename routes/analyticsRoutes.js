const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getOverview } = require("../controllers/analyticsController");

// ===============================
// ANALYTICS ROUTES (ADMIN ONLY)
// ===============================

// GET /api/analytics/overview
router.get(
  "/overview",
  auth,
  role("admin"),
  getOverview
);

module.exports = router;
