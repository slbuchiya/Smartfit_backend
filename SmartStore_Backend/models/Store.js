const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: String,
    address: String,
    gst: String,
    planType: { type: String, default: 'Yearly' },
    expiryDate: { type: Date, required: true },
    status: { type: String, default: 'active', enum: ['active', 'suspended'] }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);