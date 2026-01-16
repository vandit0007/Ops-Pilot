const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");


const {
  getIssues,
  createIssue,
  updateStatus,
  assignIssue,
} = require("../controllers/issueController");

// ------------------------------------
// ROUTES
// ------------------------------------

// GET all issues
router.get("/", auth, getIssues);

// CREATE issue
router.post("/", auth, createIssue);

// UPDATE status
router.patch("/:id/status", auth, updateStatus);

// ASSIGN issue (admin)
router.patch("/:id/assign", auth, assignIssue);

module.exports = router;
