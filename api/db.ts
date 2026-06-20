import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const nowIso = () => new Date().toISOString();

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost REAL NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

interface ProductRow {
  id: number;
  created_at: string;
  updated_at: string;
}

const existingRows = db.prepare('SELECT id, created_at, updated_at FROM products').all() as ProductRow[];
if (existingRows.length > 0) {
  const updateStmt = db.prepare('UPDATE products SET created_at = ?, updated_at = ? WHERE id = ?');
  const migrate = db.transaction(() => {
    for (const row of existingRows) {
      if (!row.created_at.includes('T') || !row.created_at.endsWith('Z')) {
        const convertedCreated = row.created_at.includes('T')
          ? row.created_at + 'Z'
          : new Date(row.created_at.replace(' ', 'T') + 'Z').toISOString();
        const convertedUpdated = row.updated_at.includes('T')
          ? row.updated_at + 'Z'
          : new Date(row.updated_at.replace(' ', 'T') + 'Z').toISOString();
        updateStmt.run(convertedCreated, convertedUpdated, row.id);
      }
    }
  });
  migrate();
  console.log('已有数据时间格式迁移完成');
}

const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get() as { cnt: number };
if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, cost, price, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
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
      const ts = nowIso();
      insert.run(p.name, p.category, p.cost, p.price, ts, ts);
    }
  });

  insertMany();
  console.log('数据库初始化完成，已插入预置数据');
} else {
  console.log('数据库已存在，读取现有记录');
}

export default db;
