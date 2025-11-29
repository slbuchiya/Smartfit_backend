const Order = require('../models/Order');
const Product = require('../models/Product');

const OrderController = {
    // 1. Create Order
    async create(req, res) {
        try {
            const { saleId, customerName, items, total, subtotal, discount, tax, paymentStatus, paymentMode, amountPaid, balanceDue, date } = req.body;
            const lines = items || req.body.lines;

            if (!lines || lines.length === 0) {
                return res.status(400).json({ error: 'Order must include items' });
            }

            const orderItems = [];
            for (const line of lines) {
                const prodId = line.productId || line.product;
                const product = await Product.findById(prodId);

                if (!product) {
                    return res.status(404).json({ error: `Product not found: ${prodId}` });
                }

                if (product.stock >= line.qty) {
                    product.stock -= line.qty;
                    await product.save();
                }

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    quantity: line.qty,
                    price: line.price,
                    taxPercent: line.taxPercent || 0,
                    discountPercent: line.discountPercent || 0
                });
            }

            const order = await Order.create({
                saleId: saleId || `SAL-${Date.now()}`,
                customerName,
                items: orderItems,
                subtotal,
                discount,
                tax,
                total,
                paymentStatus,
                paymentMode,
                amountPaid,
                balanceDue,
                date: date || new Date()
            });

            res.status(201).json(order);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }, // <--- Comma (,)

    // 2. List Orders
    async list(req, res) {
        try {
            const orders = await Order.find().sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }, // <--- Comma (,) ખાસ ચેક કરો. આ ન હોવાથી નીચેનું ફંક્શન દેખાતું નહોતું.

    // 3. Get Single Order (આ ફંક્શન ખૂટતું હતું)
    async get(req, res) {
        try {
            const order = await Order.findById(req.params.id).populate('items.product');
            if (!order) return res.status(404).json({ error: 'Order not found' });
            res.json(order);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = OrderController;