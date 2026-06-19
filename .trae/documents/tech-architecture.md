## 1. 架构设计

```mermaid
flowchart TD
    subgraph "前端 (React + Vite, 端口 3861)"
        A["成品参数配置面板"] --> B["组合收益推演表格"]
        A --> C["API 请求层"]
        C --> D["Axios HTTP Client"]
    end

    subgraph "后端 (Express, 端口 8864)"
        E["成品数据控制器"] --> F["组合排列引擎"]
        F --> G["毛利计算服务"]
        G --> H["利润分级排序"]
    end

    D -->|"POST /api/products"| E
    D -->|"GET /api/combinations"| F
    D -->|"PUT /api/products/:id"| E
    E -->|"成品数据变更触发"| F
    F -->|"返回组合方案"| D
```

## 2. 技术说明

- 前端：React@18 + TypeScript + TailwindCSS@3 + Vite
- 初始化工具：vite-init（react-express-ts 模板）
- 后端：Express@4 + TypeScript（ESM 格式）
- 数据库：无数据库，使用内存数据结构存储成品与组合数据
- 状态管理：Zustand
- HTTP 客户端：Axios
- 图标库：lucide-react

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 主页面，包含成品参数配置与组合收益推演 |

## 4. API 定义

### 4.1 成品管理

```typescript
interface Product {
  id: string;
  name: string;
  category: "pottery" | "aromatherapy" | "plaster" | "leather" | "candle" | "other";
  cost: number;
  price: number;
}

// GET /api/products - 获取所有成品
// Response: { products: Product[] }

// POST /api/products - 新增成品
// Request: Omit<Product, "id">
// Response: { product: Product }

// PUT /api/products/:id - 更新成品
// Request: Partial<Omit<Product, "id">>
// Response: { product: Product }

// DELETE /api/products/:id - 删除成品
// Response: { success: boolean }
```

### 4.2 组合推演

```typescript
interface CombinationItem {
  productId: string;
  productName: string;
  category: string;
  cost: number;
  price: number;
  profit: number;
  profitRate: number;
}

interface Combination {
  id: string;
  name: string;
  items: CombinationItem[];
  totalCost: number;
  totalPrice: number;
  totalProfit: number;
  overallProfitRate: number;
  profitLevel: "high" | "medium" | "low";
}

// GET /api/combinations - 获取所有组合方案
// Response: { combinations: Combination[] }
```

### 4.3 实时重算触发

```typescript
// POST /api/combinations/recalculate - 触发全量重算
// Response: { combinations: Combination[] }
```

## 5. 服务端架构图

```mermaid
flowchart TD
    A["Express Router"] --> B["ProductController"]
    A --> C["CombinationController"]
    B --> D["ProductService (内存存储)"]
    C --> E["CombinationService"]
    E --> F["排列算法 (2~4件组合)"]
    E --> G["毛利计算"]
    E --> H["利润分级排序"]
    D -->|"数据变更通知"| E
```

## 6. 数据模型

### 6.1 数据模型定义

```mermaid
erDiagram
    Product {
        string id PK
        string name
        string category
        number cost
        number price
    }
    Combination {
        string id PK
        string name
        number totalCost
        number totalPrice
        number totalProfit
        number overallProfitRate
        string profitLevel
    }
    CombinationItem {
        string id PK
        string combinationId FK
        string productId FK
        number profit
        number profitRate
    }
    Combination ||--o{ CombinationItem : contains
    Product ||--o{ CombinationItem : referenced
```

### 6.2 数据定义

本工具使用内存数据结构，无需数据库 DDL。初始化时预置 6 款示范成品数据：

| 名称 | 分类 | 成本(元) | 售价(元) |
|------|------|----------|----------|
| 陶艺花瓶 | pottery | 18 | 58 |
| 香薰蜡烛 | aromatherapy | 12 | 45 |
| 石膏娃娃 | plaster | 8 | 35 |
| 手工皮夹 | leather | 25 | 78 |
| 果冻蜡杯 | candle | 10 | 38 |
| 陶艺茶杯 | pottery | 15 | 48 |
