const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/readMiddleware");
const readTargetController = require("../controllers/targetController");

router.get("/all", authMiddleware, readTargetController.getAllTargets);
router.get("/:id", authMiddleware, readTargetController.getTargetById);

module.exports = router;