const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const uploadController = require("../controllers/uploadController");
const { uploadFile } = require('../controllers/uploadController');
const { getUploadFromRequest } = require("../controllers/uploadController")
const Producer = require("../services/messageProducer");

router.post("/", auth, upload.any(), async (req, res) => {
    try {
        const upload = await getUploadFromRequest(req);
        await upload.save();
        await Producer.publishMessage(upload);
        res.status(201).json({ message: "Upload opgeslagen en bericht verzonden" });
    } catch (err) {
        console.error("Fout bij / route:", err.message);
        res.status(500).json({ message: "Er is iets fout gegaan" });
    }
});

router.delete("/:uploadId", auth, uploadController.deleteUpload);


module.exports = router;