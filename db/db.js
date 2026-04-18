const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/church.db', (err) => {
    if (err) {
        console.error(err.message)
    } else {
        console.log('Connected to the church database.')
    }
})

db.serialize(() => {

    db.run("PRAGMA foreign_keys = ON")

    const schema = `
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS churches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        admin_id INTEGER,
        total_members INTEGER DEFAULT 0 NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES user (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        church_id INTEGER NOT NULL,
        FOREIGN KEY (church_id) REFERENCES churches (id) ON DELETE CASCADE
    );
    `

    db.exec(schema, (err) => {
        if (err) console.error(err.message)
        else console.log('Multiple tables created successfully.')
    })
})

db.asyncGet = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err)
            else resolve(row)
        })
    })

db.asyncAll = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })

db.asyncRun = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err)
            else resolve(this)
        })
    })

module.exports = db