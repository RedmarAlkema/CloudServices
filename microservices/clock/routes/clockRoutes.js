const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("✅ Clock service draait!");
});

module.exports = router;