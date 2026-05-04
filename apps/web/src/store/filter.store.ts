import { create } from "zustand";

interface FilterState {
  search: string;
  categorySlug: string;
  provinceId: number | null;
  cityId: number | null;
  isVerified: boolean;
  ratingMin: number | null;
  sort: "rating_avg" | "review_count" | "created_at";
  order: "asc" | "desc";
  page: number;

  setFilter: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  search: "",
  categorySlug: "",
  provinceId: null,
  cityId: null,
  isVerified: false,
  ratingMin: null,
  sort: "rating_avg" as const,
  order: "desc" as const,
  page: 1,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,

  setFilter: (filters) =>
    set((state) => ({ ...state, ...filters, page: 1 })),

  resetFilters: () => set(defaultFilters),
}));
