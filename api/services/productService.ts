import { Product, Category } from "../types.js";
import db from "../db.js";

const CATEGORY_LABELS: Record<Category, string> = {
  pottery: "陶艺",
  aromatherapy: "香薰",
  plaster: "石膏娃娃",
  leather: "皮艺",
  candle: "蜡烛",
  other: "其他",
};

interface ProductRow {
  id: number;
  name: string;
  category: string;
  cost: number;
  price: number;
  created_at: string;
  updated_at: string;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category as Category,
    cost: row.cost,
    price: row.price,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllProducts(): Product[] {
  const rows = db.prepare('SELECT * FROM products ORDER BY id ASC').all() as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductById(id: string): Product | undefined {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const insert = db.prepare(`
    INSERT INTO products (name, category, cost, price, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = db.transaction(() => {
    const ts = new Date().toISOString();
    const info = insert.run(data.name, data.category, data.cost, data.price, ts, ts);
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid) as ProductRow;
    return rowToProduct(row);
  })();

  return result;
}

export function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Product | null {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)) as ProductRow | undefined;
  if (!existing) return null;

  const fields: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category);
  }
  if (data.cost !== undefined) {
    fields.push('cost = ?');
    values.push(data.cost);
  }
  if (data.price !== undefined) {
    fields.push('price = ?');
    values.push(data.price);
  }

  if (fields.length === 0) {
    return rowToProduct(existing);
  }

  fields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(Number(id));

  const result = db.transaction(() => {
    const stmt = db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)) as ProductRow;
    return rowToProduct(row);
  })();

  return result;
}

export function deleteProduct(id: string): boolean {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)) as ProductRow | undefined;
  if (!existing) return false;

  const result = db.transaction(() => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const info = stmt.run(Number(id));
    return info.changes > 0;
  })();

  return result;
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category] || category;
}
