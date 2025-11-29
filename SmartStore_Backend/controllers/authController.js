const jwt = require('jsonwebtoken');
const Store = require('../models/Store');

exports.storeLogin = async (req, res) => {
    try {
        const { storeId, password } = req.body;
        const store = await Store.findOne({ storeId });

        if (!store) return res.status(404).json({ error: 'Store not found' });
        if (store.password !== password) return res.status(401).json({ error: 'Invalid password' }); // Production માં bcrypt વાપરવું
        if (store.status === 'suspended') return res.status(403).json({ error: 'Account Suspended' });

        const token = jwt.sign({ id: store._id, storeId: store.storeId, role: 'store_owner' }, process.env.JWT_SECRET);

        res.json({
            token,
            storeId: store.storeId,
            name: store.storeName,
            ownerName: store.ownerName,
            address: store.address,
            gst: store.gst,
            mobile: store.mobile,
            role: 'store_owner'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.adminLogin = async (req, res) => {
    const { adminId, password } = req.body;
    if (adminId === "admin" && password === "admin123") {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET);
        res.json({ token, role: 'admin', name: 'Super Admin' });
    } else {
        res.status(401).json({ error: 'Invalid Admin Credentials' });
    }
};