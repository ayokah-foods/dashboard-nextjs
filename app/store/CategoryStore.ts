import { create } from 'zustand';

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  type: string;
  status?: 'active' | 'inactive';
  created_at?: string;
}

interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  clearCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({ categories: [category, ...state.categories] })),
  clearCategories: () => set({ categories: [] }),
}));
