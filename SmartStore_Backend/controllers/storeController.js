const Store = require('../models/Store');

exports.list = async (req, res) => {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.json(stores);
};

exports.create = async (req, res) => {
    try {
        console.log('Received store creation request:', req.body);
        const newStore = new Store(req.body);
        await newStore.save();
        console.log('Store saved successfully:', newStore);
        res.status(201).json(newStore);
    } catch (err) {
        console.error('Error saving store:', err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    const updated = await Store.findOneAndUpdate({ storeId: req.params.storeId }, req.body, { new: true });
    res.json(updated);
};

exports.remove = async (req, res) => {
    await Store.findOneAndDelete({ storeId: req.params.storeId });
    res.json({ message: 'Deleted' });
};

// Store Owner Profile Update
exports.updateProfile = async (req, res) => {
    const updated = await Store.findOneAndUpdate(
        { storeId: req.storeId },
        {
            storeName: req.body.storeName,
            address: req.body.address,
            mobile: req.body.mobile,
            gst: req.body.gst
        },
        { new: true }
    );
    res.json(updated);
};