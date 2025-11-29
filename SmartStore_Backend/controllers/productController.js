const Product = require('../models/Product');

exports.list = async (req, res) => {
    // Only fetch products for the logged-in store
    const products = await Product.find({ storeId: req.storeId });
    res.json(products);
};

exports.create = async (req, res) => {
    try {
        const product = new Product({ ...req.body, storeId: req.storeId });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    const updated = await Product.findOneAndUpdate(
        { _id: req.params.id, storeId: req.storeId },
        req.body,
        { new: true }
    );
    res.json(updated);
};

exports.remove = async (req, res) => {
    await Product.findOneAndDelete({ _id: req.params.id, storeId: req.storeId });
    res.json({ message: 'Product deleted' });
};