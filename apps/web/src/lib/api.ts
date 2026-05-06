import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_API_URL = API_URL;
export const apiClient = axios.create({
  baseURL: typeof window === "undefined" ? INTERNAL_API_URL : API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

// Attach token from Zustand store on every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear auth state and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Generic fetch helper
export async function apiFetch<T>(endpoint: string): Promise<T> {
  const { data } = await apiClient.get<T>(endpoint);
  return data;
}
