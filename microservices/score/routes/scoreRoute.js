const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");

router.get("/", (req, res) => {
  res.send("✅ Score service draait");
});

router.get("/score/:uploadId", scoreController.getScore);
router.get("/winner/:targetId", scoreController.getWinner);

router.get("/scores/:targetId", async (req, res) => {
  const result = await scoreController.getAllScores(req.params.targetId);
  res.json(result);
});

module.exports = router;