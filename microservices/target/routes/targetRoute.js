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

router.post("/sendTarget", auth, upload.any(), async(req,res,next) => {
await Producer.publishMessage("Info", targetController.getTargetFromRequest(req))
res.send(); 
})

module.exports = router;