const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.get("/me", auth, (req, res) => {
  res.json({
    msg: "You made it 🔐",
    user: req.user
  });
});

module.exports = router;
