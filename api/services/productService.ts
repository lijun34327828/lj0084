import { Product, Category } from "../types.js";

const CATEGORY_LABELS: Record<Category, string> = {
  pottery: "陶艺",
  aromatherapy: "香薰",
  plaster: "石膏娃娃",
  leather: "皮艺",
  candle: "蜡烛",
  other: "其他",
};

let products: Product[] = [
  { id: "1", name: "陶艺花瓶", category: "pottery", cost: 18, price: 58 },
  { id: "2", name: "香薰蜡烛", category: "aromatherapy", cost: 12, price: 45 },
  { id: "3", name: "石膏娃娃", category: "plaster", cost: 8, price: 35 },
  { id: "4", name: "手工皮夹", category: "leather", cost: 25, price: 78 },
  { id: "5", name: "果冻蜡杯", category: "candle", cost: 10, price: 38 },
  { id: "6", name: "陶艺茶杯", category: "pottery", cost: 15, price: 48 },
  { id: "7", name: "手工相框", category: "other", cost: 30, price: 48 },
  { id: "8", name: "干花香囊", category: "aromatherapy", cost: 22, price: 42 },
];

let nextId = 9;

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function createProduct(data: Omit<Product, "id">): Product {
  const product: Product = { id: String(nextId++), ...data };
  products.push(product);
  return product;
}

export function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Product | null {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data };
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category] || category;
}
