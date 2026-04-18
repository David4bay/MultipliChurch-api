const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const schema = `
CREATE TABLE IF NOT EXISTS member (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS churches (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    admin_id INTEGER,
    total_members INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admin (id)
`;

db.exec(schema, (err) => {
    if (err) console.error(err.message);
    else console.log('Multiple tables created successfully.');
});

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

module.exports = db;