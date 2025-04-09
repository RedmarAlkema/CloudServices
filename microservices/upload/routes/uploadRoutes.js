const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const { uploadFile } = require('../controllers/uploadController');

router.post('/', upload.single('upload'), uploadFile);

module.exports = router;