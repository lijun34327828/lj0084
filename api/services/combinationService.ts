import { Product, Combination, CombinationItem } from "../types.js";
import { getAllProducts, getCategoryLabel } from "./productService.js";

function generateCombinations(arr: Product[], minSize: number, maxSize: number): Product[][] {
  const results: Product[][] = [];

  function backtrack(start: number, current: Product[]) {
    if (current.length >= minSize && current.length <= maxSize) {
      results.push([...current]);
    }
    if (current.length >= maxSize) return;
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return results;
}

function calculateProfitLevel(rate: number): "high" | "medium" | "low" {
  if (rate >= 0.70) return "high";
  if (rate >= 0.55) return "medium";
  return "low";
}

function buildCombinationName(items: CombinationItem[]): string {
  return items.map((item) => item.productName).join(" + ");
}

export function calculateCombinations(): Combination[] {
  const products = getAllProducts();
  if (products.length < 2) return [];

  const combos = generateCombinations(products, 2, 4);

  const combinations: Combination[] = combos.map((combo, idx) => {
    const items: CombinationItem[] = combo.map((p) => {
      const profit = p.price - p.cost;
      const profitRate = p.price > 0 ? profit / p.price : 0;
      return {
        productId: p.id,
        productName: p.name,
        category: getCategoryLabel(p.category as any),
        cost: p.cost,
        price: p.price,
        profit,
        profitRate,
      };
    });

    const totalCost = items.reduce((sum, i) => sum + i.cost, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price, 0);
    const totalProfit = totalPrice - totalCost;
    const overallProfitRate = totalPrice > 0 ? totalProfit / totalPrice : 0;
    const profitLevel = calculateProfitLevel(overallProfitRate);

    return {
      id: String(idx + 1),
      name: buildCombinationName(items),
      items,
      totalCost,
      totalPrice,
      totalProfit,
      overallProfitRate,
      profitLevel,
    };
  });

  combinations.sort((a, b) => b.overallProfitRate - a.overallProfitRate);

  return combinations;
}
