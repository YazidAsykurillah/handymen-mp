import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export interface PortfolioImage {
  id: number;
  image_url: string;
  caption: string | null;
  is_thumbnail: boolean;
  order: number;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string | null;
  order: number;
  images: PortfolioImage[];
  thumbnail: PortfolioImage | null;
}

export function usePortfolios() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const res = await apiClient.get("/handyman/portfolios");
      return res.data.data as Portfolio[];
    },
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.portfolio");

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiClient.post("/handyman/portfolios", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(t("createSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });
}

export function useAddPortfolioImages(portfolioId: number) {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.portfolio");

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiClient.post(`/handyman/portfolios/${portfolioId}/images`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(t("updateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });
}

export function useSetThumbnail() {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.portfolio");

  return useMutation({
    mutationFn: async (imageId: number) => {
      await apiClient.patch(`/handyman/portfolios/images/${imageId}/thumbnail`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(t("thumbnailSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });
}

export function useDeletePortfolioImage() {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.portfolio");

  return useMutation({
    mutationFn: async (imageId: number) => {
      await apiClient.delete(`/handyman/portfolios/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(t("imageDeleteSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });
}

export function useUpdatePortfolio(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      const res = await apiClient.put(`/handyman/portfolios/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success("Project updated successfully!");
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.portfolio");

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/handyman/portfolios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(t("deleteSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });
}
