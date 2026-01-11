const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));


// db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch((err) => console.error(err));

// test route
app.get("/", (req, res) => {
  res.send("OpsPilot API running 🚀");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
