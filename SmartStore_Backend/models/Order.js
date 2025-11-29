const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    saleId: { type: String, required: true }, // Added saleId (e.g., SAL-2025-0001)
    customerName: { type: String, required: true }, // Changed from user ID to Name
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            quantity: Number,
            price: Number,
            taxPercent: Number,
            discountPercent: Number
        }
    ],
    subtotal: Number,
    discount: Number,
    tax: Number,
    total: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Unpaid' },
    paymentMode: String,
    amountPaid: Number,
    balanceDue: Number,
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);