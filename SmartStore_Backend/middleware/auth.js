const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // User info (id, role)

        // જો યુઝર સ્ટોર ઓનર હોય, તો storeId સેટ કરો
        if (decoded.storeId) {
            req.storeId = decoded.storeId;
        }

        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

module.exports = auth;