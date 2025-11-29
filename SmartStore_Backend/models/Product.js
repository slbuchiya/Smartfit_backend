const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    storeId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    unit: { type: String, default: 'pcs' },
    stock: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    reorder: { type: Number, default: 5 },
    image: String
}, { timestamps: true });

// Frontend needs 'id' instead of '_id'
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Product', productSchema);