export type Category = "pottery" | "aromatherapy" | "plaster" | "leather" | "candle" | "other";

export interface Product {
  id: string;
  name: string;
  category: Category;
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
