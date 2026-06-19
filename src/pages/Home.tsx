import { useEffect } from "react";
import { Calculator, Package } from "lucide-react";
import { useStore } from "@/stores/useStore";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import CombinationTable from "@/components/CombinationTable";

export default function Home() {
  const loadProducts = useStore((s) => s.loadProducts);
  const loadCombinations = useStore((s) => s.loadCombinations);
  const products = useStore((s) => s.products);
  const combinations = useStore((s) => s.combinations);

  useEffect(() => {
    loadProducts();
    loadCombinations();
  }, [loadProducts, loadCombinations]);

  const totalProducts = products.length;
  const totalCombinations = combinations.length;
  const highProfitCount = combinations.filter((c) => c.profitLevel === "high").length;
  const bestRate = combinations.length > 0
    ? (Math.max(...combinations.map((c) => c.overallProfitRate)) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen">
      <header className="border-b border-clay-700/30 bg-clay-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-clay-400/20 flex items-center justify-center">
              <Calculator size={20} className="text-clay-300" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-clay-100 tracking-wide">
                Handcraft Profit
              </h1>
              <p className="text-xs text-clay-500">手作店组合毛利测算工具</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-clay-200">{totalProducts}</div>
              <div className="text-xs text-clay-500">成品</div>
            </div>
            <div className="w-px h-8 bg-clay-700/50" />
            <div className="text-center">
              <div className="text-lg font-bold text-clay-200">{totalCombinations}</div>
              <div className="text-xs text-clay-500">组合</div>
            </div>
            <div className="w-px h-8 bg-clay-700/50" />
            <div className="text-center">
              <div className="text-lg font-bold text-profit-high">{highProfitCount}</div>
              <div className="text-xs text-clay-500">高利润</div>
            </div>
            <div className="w-px h-8 bg-clay-700/50" />
            <div className="text-center">
              <div className="text-lg font-bold text-profit-high">{bestRate}%</div>
              <div className="text-xs text-clay-500">最高毛利率</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <ProductForm />
            <ProductList />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <CombinationTable />
          </div>
        </div>
      </main>

      <footer className="border-t border-clay-700/20 mt-8">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-clay-600">
            <Package size={12} />
            <span>手作店组合毛利测算工具</span>
          </div>
          <div className="text-xs text-clay-600">
            修改任意成品参数后自动重算
          </div>
        </div>
      </footer>
    </div>
  );
}
