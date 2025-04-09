const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const { uploadFile } = require('../controllers/uploadController');

router.post('/', auth, upload.single('upload'), uploadFile);

module.exports = router;