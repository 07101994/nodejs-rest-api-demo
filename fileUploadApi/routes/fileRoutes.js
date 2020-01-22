const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Route for csv file upload
router.post('/upload',fileController.uploadFile.single('file'), fileController.uploadFileCallback);

module.exports = router;