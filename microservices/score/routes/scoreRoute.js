const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");

router.get("/", (req, res) => {
  res.send("✅ Score service draait");
});

router.get("/score/:uploadId", scoreController.getScore);
router.get("/winner/:targetId", scoreController.getWinner);

module.exports = router;