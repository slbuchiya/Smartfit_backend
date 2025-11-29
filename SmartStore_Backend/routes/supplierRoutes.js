const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplierController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', controller.list);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

module.exports = router;