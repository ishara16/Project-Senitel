const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'docs', 'sentinel.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS service_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name TEXT NOT NULL,
    status TEXT NOT NULL,
    uptime TEXT,
    last_check TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table service_status created successfully.');
    }
  });
});

db.close();
