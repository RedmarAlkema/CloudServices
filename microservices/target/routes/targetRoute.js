const express = require("express");
const router = express.Router();
const upload = require('../middlewares/multer');
const targetController = require("../controllers/targetController");
const { uploadTarget } = require("../controllers/targetController");
const auth = require("../middlewares/targetMiddleware");
const Producer = require("../services/messageProducer");

router.post("/", auth, upload.any(), uploadTarget);
router.get("/", targetController.getAllTargets);
router.delete("/:id", auth, targetController.deleteTarget);

router.post("/sendTarget", auth, upload.any(), async (req, res, next) => {
    await Producer.publishMessage("Info", targetController.getTargetFromRequest(req))
    res.send();
});

router.post("/test", auth, upload.any(), async (req, res) => {
    try {
        const target = await targetController.getTargetFromRequest(req);
        await target.save();
        await Producer.publishMessage(target);
        res.status(201).json({ message: "Target opgeslagen en bericht verzonden" });
    } catch (err) {
        console.error("Fout bij / route:", err.message);
        res.status(500).json({ message: "Er is iets fout gegaan" });
    }
});

module.exports = router;