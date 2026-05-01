const express = require('express');
const router = express.Router();
const userController = require('../controller/Users/Users');

// ربط المسار بالدالة
router.get('/all', userController.getAllUsers);
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.post('/resetPassword', userController.resetPassword);
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;