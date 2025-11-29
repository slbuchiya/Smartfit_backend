const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    storeId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    contact: String,
    email: String,
    address: String,
    gst: String
}, { timestamps: true });

supplierSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Supplier', supplierSchema);