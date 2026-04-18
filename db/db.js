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
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        isAdmin BOOLEAN NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS churches (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        admin_id INTEGER,
        total_members INTEGER DEFAULT 0 NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES user (id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (total_members) REFERENCES members (id) ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        church_id INTEGER,
        FOREIGN KEY (church_id) REFERENCES churches (id)
    );
     `
    db.exec(schema, (err) => {
        if (err) console.error(err.message)
        else console.log('Multiple tables created successfully.')
    })
})

// Promisified helpers
db.asyncGet = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err)
            else resolve(row)
        })
    })

db.asyncRun = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err)
            else resolve(this) // `this.lastID` and `this.changes` available
        })
    })

module.exports = db