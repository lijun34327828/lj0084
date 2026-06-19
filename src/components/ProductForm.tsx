import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/stores/useStore";

const CATEGORIES = [
  { value: "pottery", label: "陶艺" },
  { value: "aromatherapy", label: "香薰" },
  { value: "plaster", label: "石膏娃娃" },
  { value: "leather", label: "皮艺" },
  { value: "candle", label: "蜡烛" },
  { value: "other", label: "其他" },
];

export default function ProductForm() {
  const addProduct = useStore((s) => s.addProduct);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("pottery");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cost || !price) return;
    setSubmitting(true);
    try {
      await addProduct({
        name: name.trim(),
        category,
        cost: Number(cost),
        price: Number(price),
      });
      setName("");
      setCost("");
      setPrice("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg font-bold text-clay-200 tracking-wide">
        添加成品
      </h3>

      <div>
        <label className="block text-xs text-clay-400 mb-1 font-medium">成品名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：陶艺花瓶"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-clay-400 mb-1 font-medium">分类</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-clay-400 mb-1 font-medium">成本 (元)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-clay-400 mb-1 font-medium">售价 (元)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="input-field"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
        {submitting ? "添加中..." : "添加成品"}
      </button>
    </form>
  );
}
