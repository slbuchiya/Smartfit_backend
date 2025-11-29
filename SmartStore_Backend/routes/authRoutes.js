const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/store-login', controller.storeLogin);
router.post('/admin-login', controller.adminLogin);

module.exports = router;