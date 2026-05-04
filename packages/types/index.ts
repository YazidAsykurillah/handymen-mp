// Defines the SHAPE of a category object returned by the API.
export interface Category {
  id: number;
  slug: string;   // e.g. "electrical", "plumbing"
  name: string;   // e.g. "Electrical", "Plumbing"
  icon?: string;
}

export interface Handyman {
  id: number;
  name: string;
  slug: string;
  categories: Category[];
  city: string;
  province: string;
  phone: string;
  whatsapp?: string;
  bio?: string;
  profile_photo?: string;
  portfolio: Portfolio[];
  is_verified: boolean;
  is_premium: boolean;
  rating_avg: number;
  review_count: number;
  created_at: string;
}

export interface Portfolio {
  id: number;
  handyman_id: number;
  photo_url: string;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
