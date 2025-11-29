const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    storeId: { type: String, required: true, index: true },
    purchaseId: { type: String, required: true },
    supplierName: { type: String, required: true },
    billNo: String,
    date: { type: Date, default: Date.now },
    notes: String,

    lines: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        qty: Number,
        price: Number,
        taxPercent: Number,
        discountPercent: Number
    }],

    total: Number,
    amountPaid: { type: Number, default: 0 },
    paymentStatus: String,
    balanceDue: Number
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);