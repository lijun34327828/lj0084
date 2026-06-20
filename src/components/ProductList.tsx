import { useState, useEffect, useRef } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { useStore } from "@/stores/useStore";
import type { Product } from "@/utils/api";

const CATEGORY_MAP: Record<string, string> = {
  pottery: "陶艺",
  aromatherapy: "香薰",
  plaster: "石膏娃娃",
  leather: "皮艺",
  candle: "蜡烛",
  other: "其他",
};

const CATEGORY_COLORS: Record<string, string> = {
  pottery: "bg-amber-700/30 text-amber-300",
  aromatherapy: "bg-purple-700/30 text-purple-300",
  plaster: "bg-sky-700/30 text-sky-300",
  leather: "bg-orange-700/30 text-orange-300",
  candle: "bg-rose-700/30 text-rose-300",
  other: "bg-gray-600/30 text-gray-300",
};

function formatDateTime(isoStr: string): string {
  try {
    const date = new Date(isoStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return isoStr;
  }
}

function ProductRow({ product }: { product: Product }) {
  const editProduct = useStore((s) => s.editProduct);
  const removeProduct = useStore((s) => s.removeProduct);
  const [editing, setEditing] = useState(false);
  const [cost, setCost] = useState(String(product.cost));
  const [price, setPrice] = useState(String(product.price));
  const [name, setName] = useState(product.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleSave = async () => {
    const newCost = Number(cost);
    const newPrice = Number(price);
    if (isNaN(newCost) || isNaN(newPrice)) return;
    await editProduct(product.id, {
      name: name.trim() || product.name,
      cost: newCost,
      price: newPrice,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setCost(String(product.cost));
    setPrice(String(product.price));
    setName(product.name);
    setEditing(false);
  };

  const handleDelete = async () => {
    await removeProduct(product.id);
  };

  const profit = product.price - product.cost;
  const profitRate = product.cost > 0 ? (profit / product.cost * 100).toFixed(1) : "0";

  if (editing) {
    return (
      <tr className="border-b border-clay-700/30">
        <td className="py-2 px-3">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field py-1 text-xs"
          />
        </td>
        <td className="py-2 px-3">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${CATEGORY_COLORS[product.category] || CATEGORY_COLORS.other}`}>
            {CATEGORY_MAP[product.category] || product.category}
          </span>
        </td>
        <td className="py-2 px-3">
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            min="0"
            step="0.01"
            className="input-field py-1 text-xs w-20"
          />
        </td>
        <td className="py-2 px-3">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="input-field py-1 text-xs w-20"
          />
        </td>
        <td className="py-2 px-3 text-xs text-clay-400">-</td>
        <td className="py-2 px-3 text-xs text-clay-400">-</td>
        <td className="py-2 px-3">
          <div className="flex items-center gap-1">
            <button onClick={handleSave} className="p-1 rounded-full hover:bg-profit-high/20 text-profit-high transition-colors">
              <Check size={14} />
            </button>
            <button onClick={handleCancel} className="p-1 rounded-full hover:bg-profit-low/20 text-profit-low transition-colors">
              <X size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-clay-700/30 hover:bg-clay-100/5 transition-colors group">
      <td className="py-2.5 px-3 text-sm text-clay-100 font-medium">{product.name}</td>
      <td className="py-2.5 px-3">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${CATEGORY_COLORS[product.category] || CATEGORY_COLORS.other}`}>
          {CATEGORY_MAP[product.category] || product.category}
        </span>
      </td>
      <td className="py-2.5 px-3 text-sm text-clay-300">¥{product.cost.toFixed(0)}</td>
      <td className="py-2.5 px-3 text-sm text-clay-200 font-medium">¥{product.price.toFixed(0)}</td>
      <td className="py-2.5 px-3">
        <span className={`text-xs font-semibold ${profit >= 0 ? "text-profit-high" : "text-profit-low"}`}>
          ¥{profit.toFixed(0)} ({profitRate}%)
        </span>
      </td>
      <td className="py-2.5 px-3 text-xs text-clay-400 whitespace-nowrap">
        {formatDateTime(product.updatedAt)}
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded-full hover:bg-clay-400/20 text-clay-400 hover:text-clay-200 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-profit-low/20 text-clay-400 hover:text-profit-low transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductList() {
  const products = useStore((s) => s.products);

  return (
    <div className="card p-5">
      <h3 className="font-display text-lg font-bold text-clay-200 tracking-wide mb-4">
        成品列表
      </h3>
      {products.length === 0 ? (
        <div className="text-center py-8 text-clay-500 text-sm">
          暂无成品，请在上方添加
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-clay-600/40">
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">名称</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">分类</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">成本</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">售价</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">毛利</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">上次修改时间</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-clay-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
