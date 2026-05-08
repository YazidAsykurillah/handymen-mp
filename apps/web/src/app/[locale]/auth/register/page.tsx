import RegisterView from "@/views/auth/RegisterView";
import { apiClient } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Cari Tukang",
  description:
    "Create an account on Cari Tukang — join as a homeowner or register as a professional handyman.",
};

export default async function RegisterPage() {
  let initialProvinces = [];
  let initialCategories = [];

  try {
    const [provincesRes, categoriesRes] = await Promise.all([
      apiClient.get("/provinces"),
      apiClient.get("/categories"),
    ]);
    initialProvinces = provincesRes.data.data;
    initialCategories = categoriesRes.data.data;
  } catch (error) {
    console.error("Failed to fetch register data:", error);
  }

  return (
    <RegisterView
      initialProvinces={initialProvinces}
      initialCategories={initialCategories}
    />
  );
}
