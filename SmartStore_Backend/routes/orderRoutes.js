const express = require('express');
const router = express.Router();

// ધ્યાન આપો: અહીં ફાઈલનું નામ જે તમારા ફોલ્ડરમાં હોય તે જ હોવું જોઈએ.
// જો તમારી ફાઈલનું નામ 'orderController.js' હોય તો અહીં પણ નાનું 'o' વાપરજો.
const OrderController = require('../controllers/orderController'); // નાનો 'o' વાપરો

// --- DEBUGGING BLOCK (આ કોડ તમારી ટર્મિનલમાં પ્રિન્ટ કરશે) ---
console.log("------------------------------------------------");
console.log("Debugging Controller Loading:");
console.log("1. OrderController Loaded?", !!OrderController);
console.log("2. Keys found in Controller:", OrderController ? Object.keys(OrderController) : 'NONE');
console.log("------------------------------------------------");
// -------------------------------------------------------------

// 1. Create Order
router.post('/', OrderController.create);

// 2. List Orders (Error અહીં Line 9 પર આવે છે)
// જો ઉપરના console.log માં 'list' ન દેખાય, તો Controller ફાઈલ સેવ નથી થઈ.
if (!OrderController.list) {
    console.error("CRITICAL ERROR: 'list' function is missing in OrderController!");
}
router.get('/', OrderController.list);

// 3. Get Single Order
router.get('/:id', OrderController.get);

module.exports = router;