const express = require('express');
const router = express.Router();
const userController = require('../controller/Availabilitys/Availability');
const { protect } = require('../controller/authMiddleware');
// ربط المسار بالدالة

// router.get('/all', userController.getAllAvailabilitys);
router.post('/add',protect, userController.addAvailability);
// router.put('/update/:id', userController.updateAvailability);
// router.delete('/delete/:id', userController.deleteAvailability);
module.exports = router;