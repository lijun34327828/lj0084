import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useStore } from "@/stores/useStore";
import type { Combination } from "@/utils/api";

const PROFILE_LEVEL_CONFIG = {
  high: {
    badge: "profit-badge-high",
    label: "高利润",
    icon: TrendingUp,
    barColor: "bg-profit-high",
    rowBorder: "border-l-profit-high",
    bg: "bg-profit-high/[0.03]",
  },
  medium: {
    badge: "profit-badge-medium",
    label: "中利润",
    icon: Minus,
    barColor: "bg-profit-medium",
    rowBorder: "border-l-profit-medium",
    bg: "bg-profit-medium/[0.03]",
  },
  low: {
    badge: "profit-badge-low",
    label: "低利润",
    icon: TrendingDown,
    barColor: "bg-profit-low",
    rowBorder: "border-l-profit-low",
    bg: "bg-profit-low/[0.03]",
  },
};

const PROFIT_LEVEL_LABEL: Record<string, string> = {
  high: "高利润",
  medium: "中利润",
  low: "低利润",
};

function formatDateForFilename(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}${m}${day}${h}${min}${s}`;
}

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes("\"") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportCombinationsToCsv(combinations: Combination[]): void {
  const headers = ["组合名称", "包含成品", "总成本", "总售价", "总毛利", "毛利率", "利润等级"];
  const rows = combinations.map((c) => [
    c.name,
    c.items.map((i) => i.productName).join("、"),
    c.totalCost,
    c.totalPrice,
    c.totalProfit,
    `${(c.overallProfitRate * 100).toFixed(1)}%`,
    PROFIT_LEVEL_LABEL[c.profitLevel] || c.profitLevel,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `组合方案_${formatDateForFilename()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function CombinationRow({ combo, rank }: { combo: Combination; rank: number }) {
  const [expanded, setExpanded] = useState(rank <= 3);
  const config = PROFILE_LEVEL_CONFIG[combo.profitLevel];
  const Icon = config.icon;

  return (
    <div
      className={`border-l-4 ${config.rowBorder} ${config.bg} rounded-r-xl mb-3 overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${rank * 30}ms` }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-clay-100/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-clay-500 font-display font-bold text-sm w-8">#{rank}</span>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-clay-100 truncate">{combo.name}</div>
        </div>

        <span className={config.badge}>
          <Icon size={12} className="mr-1" />
          {config.label}
        </span>

        <div className="text-right">
          <div className="text-sm font-bold text-clay-100">¥{combo.totalPrice}</div>
          <div className="text-xs text-clay-400">营收</div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-bold ${combo.profitLevel === "high" ? "text-profit-high" : combo.profitLevel === "low" ? "text-profit-low" : "text-profit-medium"}`}>
            ¥{combo.totalProfit}
          </div>
          <div className="text-xs text-clay-400">毛利</div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-bold ${combo.profitLevel === "high" ? "text-profit-high" : combo.profitLevel === "low" ? "text-profit-low" : "text-profit-medium"}`}>
            {(combo.overallProfitRate * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-clay-400">毛利率</div>
        </div>

        <div className="w-5 flex-shrink-0">
          {expanded ? (
            <ChevronUp size={16} className="text-clay-500" />
          ) : (
            <ChevronDown size={16} className="text-clay-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 pt-1 border-t border-clay-700/20">
          <div className="grid grid-cols-1 gap-2">
            {combo.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-clay-800/40"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-clay-400">{item.category}</span>
                  <span className="text-sm text-clay-200">{item.productName}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-clay-400">成本 ¥{item.cost}</span>
                  <span className="text-clay-300">售价 ¥{item.price}</span>
                  <span className={`font-semibold ${item.profit >= 0 ? "text-profit-high" : "text-profit-low"}`}>
                    毛利 ¥{item.profit}
                  </span>
                  <span className={`font-semibold ${item.profitRate >= 0.55 ? "text-profit-high" : item.profitRate < 0.4 ? "text-profit-low" : "text-profit-medium"}`}>
                    {(item.profitRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-lg bg-clay-800/60 border border-clay-600/20">
            <span className="text-xs text-clay-400">整套合计</span>
            <div className="flex items-center gap-6 text-xs">
              <span className="text-clay-400">总成本 ¥{combo.totalCost}</span>
              <span className="text-clay-300 font-medium">总营收 ¥{combo.totalPrice}</span>
              <span className={`font-bold ${combo.profitLevel === "high" ? "text-profit-high" : combo.profitLevel === "low" ? "text-profit-low" : "text-profit-medium"}`}>
                总毛利 ¥{combo.totalProfit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CombinationTable() {
  const combinations = useStore((s) => s.combinations);
  const calculating = useStore((s) => s.calculating);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filtered = filter === "all"
    ? combinations
    : combinations.filter((c) => c.profitLevel === filter);

  const stats = {
    high: combinations.filter((c) => c.profitLevel === "high").length,
    medium: combinations.filter((c) => c.profitLevel === "medium").length,
    low: combinations.filter((c) => c.profitLevel === "low").length,
  };

  const handleExport = () => {
    exportCombinationsToCsv(filtered);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-clay-200 tracking-wide">
          组合收益推演
        </h3>
        <div className="flex items-center gap-3">
          {calculating && (
            <div className="h-1 w-24 rounded-full overflow-hidden bg-clay-700">
              <div className="shimmer-bar h-full w-full" />
            </div>
          )}
          {combinations.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-600/30 text-clay-200 text-xs font-medium hover:bg-clay-500/40 transition-colors border border-clay-500/30"
            >
              <Download size={14} />
              导出方案
            </button>
          )}
        </div>
      </div>

      {combinations.length === 0 ? (
        <div className="text-center py-12 text-clay-500 text-sm">
          请先添加至少 2 件成品，系统将自动生成组合方案
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === "all"
                  ? "bg-clay-400 text-clay-900"
                  : "bg-clay-700/30 text-clay-400 hover:bg-clay-700/50"
              }`}
            >
              全部 ({combinations.length})
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === "high"
                  ? "bg-profit-high text-white"
                  : "bg-profit-high/10 text-profit-high hover:bg-profit-high/20"
              }`}
            >
              高利润 ({stats.high})
            </button>
            <button
              onClick={() => setFilter("medium")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === "medium"
                  ? "bg-profit-medium text-white"
                  : "bg-profit-medium/10 text-profit-medium hover:bg-profit-medium/20"
              }`}
            >
              中利润 ({stats.medium})
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === "low"
                  ? "bg-profit-low text-white"
                  : "bg-profit-low/10 text-profit-low hover:bg-profit-low/20"
              }`}
            >
              低利润 ({stats.low})
            </button>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
            {filtered.map((combo, idx) => (
              <CombinationRow key={combo.id} combo={combo} rank={idx + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
