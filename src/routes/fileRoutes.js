const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');


router.post('/upload',fileController.upload.single('file'), fileController.uploadFile);
// router.post('/signup', authController.signup);

// Protect all routes after this middleware
// router.use(authController.protect);

// router.delete('/deleteMe', fileController.deleteMe);

// Only admin have permission to access for the below APIs 
// router.use(authController.restrictTo('admin'));

// router
//     .route('/')
//     .get(fileController.getAllUsers);


// router
//     .route('/:id')
//     .get(fileController.getUser)
//     .patch(fileController.updateUser)
//     .delete(fileController.deleteUser);

module.exports = router;