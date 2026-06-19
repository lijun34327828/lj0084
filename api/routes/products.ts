import { Router, type Request, type Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const products = getAllProducts();
  res.json({ products });
});

router.post("/", (req: Request, res: Response) => {
  const { name, category, cost, price } = req.body;
  if (!name || !category || cost == null || price == null) {
    res.status(400).json({ error: "缺少必要参数" });
    return;
  }
  const product = createProduct({ name, category, cost: Number(cost), price: Number(price) });
  res.json({ product });
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = getProductById(id);
  if (!existing) {
    res.status(404).json({ error: "成品不存在" });
    return;
  }
  const { name, category, cost, price } = req.body;
  const updated = updateProduct(id, {
    ...(name !== undefined && { name }),
    ...(category !== undefined && { category }),
    ...(cost !== undefined && { cost: Number(cost) }),
    ...(price !== undefined && { price: Number(price) }),
  });
  res.json({ product: updated });
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const success = deleteProduct(id);
  if (!success) {
    res.status(404).json({ error: "成品不存在" });
    return;
  }
  res.json({ success: true });
});

export default router;
