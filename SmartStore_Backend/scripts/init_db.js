// scripts/init_db.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'data.sqlite');

if (fs.existsSync(dbPath)) {
    console.log('Removing existing database:', dbPath);
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT
  )`);

    db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL DEFAULT 0,
    image TEXT
  )`);

    db.run(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

    const stmt = db.prepare("INSERT INTO products (name, description, price, image) VALUES (?,?,?,?)");
    stmt.run("Sample Product 1", "A cool product", 199.99, "/images/p1.jpg");
    stmt.run("Sample Product 2", "Another item", 299.99, "/images/p2.jpg");
    stmt.run("Sample Product 3", "Budget pick", 99.99, "/images/p3.jpg");
    stmt.finalize();

    console.log('Database created and seeded at', dbPath);
});

db.close();
