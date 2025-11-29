require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB Connected Successfully'))
    .catch(err => console.error(' MongoDB Connection Error:', err));

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stores', require('./routes/storeRoutes')); // Admin Only
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/finance', require('./routes/transactionRoutes')); // Receipts & Payments

// --- Health Check ---
app.get('/', (req, res) => res.send('SmartStore API is Running...'));

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});