const Supplier = require('../models/Supplier');

exports.list = async (req, res) => {
    const list = await Supplier.find({ storeId: req.storeId });
    res.json(list);
};

exports.create = async (req, res) => {
    const supplier = new Supplier({ ...req.body, storeId: req.storeId });
    await supplier.save();
    res.json(supplier);
};

exports.remove = async (req, res) => {
    await Supplier.findOneAndDelete({ _id: req.params.id, storeId: req.storeId });
    res.json({ message: 'Deleted' });
};