const express = require('express');
const router = express.Router();
const userController = require('../controller/Users/Users');
const { protect } = require('../controller/authMiddleware');
// ربط المسار بالدالة
router.get('/all', userController.getAllUsers);
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.post('/resetPassword', userController.resetPassword);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/profile',protect, userController.getUserProfile);

module.exports = router;