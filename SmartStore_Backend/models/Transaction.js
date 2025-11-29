const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    storeId: { type: String, required: true, index: true },
    id: { type: String }, // REC-123 or PAY-123
    type: { type: String, enum: ['Receipt', 'Payment'], required: true },
    partyName: { type: String, required: true }, // Customer or Supplier
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    mode: { type: String, default: 'Cash' },
    note: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);