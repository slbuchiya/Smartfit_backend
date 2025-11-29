const express = require('express');
const router = express.Router();
const controller = require('../controllers/saleController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', controller.list);
router.post('/', controller.create);

module.exports = router;