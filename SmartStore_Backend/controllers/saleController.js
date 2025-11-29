const Sale = require('../models/Sale');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const saleData = { ...req.body, storeId: req.storeId };

        // 1. Create Sale
        const sale = new Sale(saleData);
        await sale.save({ session });

        // 2. Decrease Stock
        for (const line of saleData.lines) {
            await Product.findOneAndUpdate(
                { _id: line.productId, storeId: req.storeId },
                { $inc: { stock: -Number(line.qty) } },
                { session }
            );
        }

        await session.commitTransaction();
        res.status(201).json(sale);
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ error: err.message });
    } finally {
        session.endSession();
    }
};

exports.list = async (req, res) => {
    const sales = await Sale.find({ storeId: req.storeId }).sort({ date: -1 });
    res.json(sales);
};