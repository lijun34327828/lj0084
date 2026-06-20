import { create } from "zustand";
import {
  type Product,
  type ProductInput,
  type ProductUpdateInput,
  type Combination,
  fetchProducts,
  createProduct as apiCreate,
  updateProduct as apiUpdate,
  deleteProduct as apiDelete,
  fetchCombinations,
  recalculateCombinations,
} from "@/utils/api";

interface StoreState {
  products: Product[];
  combinations: Combination[];
  loading: boolean;
  calculating: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  loadCombinations: () => Promise<void>;
  addProduct: (data: ProductInput) => Promise<void>;
  editProduct: (id: string, data: ProductUpdateInput) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  recalculate: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  combinations: [],
  loading: false,
  calculating: false,
  error: null,

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await fetchProducts();
      set({ products, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  loadCombinations: async () => {
    set({ calculating: true, error: null });
    try {
      const combinations = await fetchCombinations();
      set({ combinations, calculating: false });
    } catch (e: any) {
      set({ error: e.message, calculating: false });
    }
  },

  addProduct: async (data) => {
    try {
      await apiCreate(data);
      const products = await fetchProducts();
      set({ products });
      await get().recalculate();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  editProduct: async (id, data) => {
    try {
      await apiUpdate(id, data);
      const products = await fetchProducts();
      set({ products });
      await get().recalculate();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  removeProduct: async (id) => {
    try {
      await apiDelete(id);
      const products = await fetchProducts();
      set({ products });
      await get().recalculate();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  recalculate: async () => {
    set({ calculating: true });
    try {
      const combinations = await recalculateCombinations();
      set({ combinations, calculating: false });
    } catch (e: any) {
      set({ error: e.message, calculating: false });
    }
  },
}));
