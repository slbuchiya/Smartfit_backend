const Transaction = require('../models/Transaction');

exports.list = async (req, res) => {
    const txns = await Transaction.find({ storeId: req.storeId }).sort({ date: -1 });
    res.json(txns);
};

exports.create = async (req, res) => {
    const txn = new Transaction({ ...req.body, storeId: req.storeId });
    await txn.save();
    res.json(txn);
};