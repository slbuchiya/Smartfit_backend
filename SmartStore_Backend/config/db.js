// config/db.js
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPath = path.join(__dirname, '..', 'data.sqlite');

let dbPromise = open({
    filename: dbPath,
    driver: sqlite3.Database
});

module.exports = {
    async get(sql, params = []) {
        const db = await dbPromise;
        return db.get(sql, params);
    },
    async all(sql, params = []) {
        const db = await dbPromise;
        return db.all(sql, params);
    },
    async run(sql, params = []) {
        const db = await dbPromise;
        return db.run(sql, params);
    },
    async prepare(sql) {
        const db = await dbPromise;
        return db.prepare(sql);
    }
};
