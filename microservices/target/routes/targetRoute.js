const express = require("express");
const router = express.Router();
const targetController = require("../controllers/targetController");
const authMiddleware = require("../middlewares/targetMiddleware");

router.post("/", authMiddleware, targetController.createTarget);
router.get("/", targetController.getAllTargets);
router.delete("/:id", authMiddleware, targetController.deleteTarget);

module.exports = router;
