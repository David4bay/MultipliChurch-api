const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const db = new sqlite3.Database(path.join(__dirname, 'church.db'), (err) => {
    if (err) console.error(err.message)
    else console.log('Connected to the church database.')
})

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON")

    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT    NOT NULL UNIQUE,
            password TEXT    NOT NULL,
            isAdmin  INTEGER NOT NULL DEFAULT 0 CHECK(isAdmin IN (0, 1))
        )
    `, (err) => { if (err) console.error('user table:', err.message) })

    db.run(`
        CREATE TABLE IF NOT EXISTS churches (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL UNIQUE,
            admin_id      INTEGER,
            total_members INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (admin_id) REFERENCES user (id) ON DELETE SET NULL ON UPDATE CASCADE
        )
    `, (err) => { if (err) console.error('churches table:', err.message) })

    db.run(`
        CREATE TABLE IF NOT EXISTS members (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id   INTEGER NOT NULL,
            church_id INTEGER NOT NULL,
            FOREIGN KEY (user_id)   REFERENCES user     (id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (church_id) REFERENCES churches (id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE (user_id, church_id)
        )
    `, (err) => { if (err) console.error('members table:', err.message) })

    db.run(`
        CREATE TRIGGER IF NOT EXISTS decrement_total_members
        AFTER DELETE ON members
        BEGIN
            UPDATE churches
            SET total_members = MAX(0, total_members - 1)
            WHERE id = OLD.church_id;
        END
    `, (err) => { if (err) console.error('trigger:', err.message) })

    db.run(`
        CREATE TRIGGER IF NOT EXISTS increment_total_members
        AFTER INSERT ON members
        BEGIN
            UPDATE churches
            SET total_members = total_members + 1
            WHERE id = NEW.church_id;
        END
    `, (err) => { if (err) console.error('trigger:', err.message) })
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