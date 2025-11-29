const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const purchaseData = { ...req.body, storeId: req.storeId };

        const purchase = new Purchase(purchaseData);
        await purchase.save({ session });

        // Increase Stock
        for (const line of purchaseData.lines) {
            await Product.findOneAndUpdate(
                { _id: line.productId, storeId: req.storeId },
                { $inc: { stock: Number(line.qty) } },
                { session }
            );
        }

        await session.commitTransaction();
        res.status(201).json(purchase);
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ error: err.message });
    } finally {
        session.endSession();
    }
};

exports.list = async (req, res) => {
    const purchases = await Purchase.find({ storeId: req.storeId }).sort({ date: -1 });
    res.json(purchases);
};