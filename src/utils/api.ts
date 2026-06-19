import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  price: number;
}

export interface CombinationItem {
  productId: string;
  productName: string;
  category: string;
  cost: number;
  price: number;
  profit: number;
  profitRate: number;
}

export interface Combination {
  id: string;
  name: string;
  items: CombinationItem[];
  totalCost: number;
  totalPrice: number;
  totalProfit: number;
  overallProfitRate: number;
  profitLevel: "high" | "medium" | "low";
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get("/products");
  return res.data.products;
}

export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  const res = await api.post("/products", data);
  return res.data.product;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<Product> {
  const res = await api.put(`/products/${id}`, data);
  return res.data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function fetchCombinations(): Promise<Combination[]> {
  const res = await api.get("/combinations");
  return res.data.combinations;
}

export async function recalculateCombinations(): Promise<Combination[]> {
  const res = await api.post("/combinations/recalculate");
  return res.data.combinations;
}
