// models/User.js
const db = require('../config/db');

const User = {
    async create({ name, email, passwordHash }) {
        const info = await db.run(
            'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)',
            [name || null, email, passwordHash]
        );
        return { id: info.lastID, name, email };
    },

    async findByEmail(email) {
        return db.get('SELECT * FROM users WHERE email = ?', [email]);
    },

    async findById(id) {
        return db.get('SELECT id, name, email FROM users WHERE id = ?', [id]);
    }
};

module.exports = User;
