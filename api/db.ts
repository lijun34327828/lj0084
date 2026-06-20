import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost REAL NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get() as { cnt: number };
if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, cost, price, created_at, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const seedProducts = [
    { name: '陶艺花瓶', category: 'pottery', cost: 18, price: 58 },
    { name: '香薰蜡烛', category: 'aromatherapy', cost: 12, price: 45 },
    { name: '石膏娃娃', category: 'plaster', cost: 8, price: 35 },
    { name: '手工皮夹', category: 'leather', cost: 25, price: 78 },
    { name: '果冻蜡杯', category: 'candle', cost: 10, price: 38 },
    { name: '陶艺茶杯', category: 'pottery', cost: 15, price: 48 },
    { name: '手工相框', category: 'other', cost: 30, price: 48 },
    { name: '干花香囊', category: 'aromatherapy', cost: 22, price: 42 },
  ];

  const insertMany = db.transaction(() => {
    for (const p of seedProducts) {
      insert.run(p.name, p.category, p.cost, p.price);
    }
  });

  insertMany();
  console.log('数据库初始化完成，已插入预置数据');
} else {
  console.log('数据库已存在，读取现有记录');
}

export default db;
