const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    storeId: { type: String, required: true, index: true },
    saleId: { type: String, required: true }, // Invoice No
    customerName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: String,

    lines: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String, // Product name snapshot
        qty: Number,
        price: Number,
        taxPercent: Number,
        discountPercent: Number
    }],

    subtotal: Number,
    discount: Number,
    tax: Number,
    total: Number,

    paymentStatus: { type: String, default: 'Unpaid' },
    amountPaid: { type: Number, default: 0 },
    paymentMode: String,
    balanceDue: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);