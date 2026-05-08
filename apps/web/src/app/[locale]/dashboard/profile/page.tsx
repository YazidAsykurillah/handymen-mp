import ProfileSettingsView from "@/views/dashboard/ProfileSettingsView";
import { apiFetch } from "@/lib/api";

interface Province {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default async function ProfilePage() {
  let provinces: Province[] = [];
  let categories: Category[] = [];

  try {
    const [provRes, catRes] = await Promise.all([
      apiFetch<{ data: Province[] }>("/provinces"),
      apiFetch<{ data: Category[] }>("/categories"),
    ]);
    provinces = provRes.data;
    categories = catRes.data;
  } catch (error) {
    console.error("Failed to fetch reference data for profile", error);
  }

  return (
    <ProfileSettingsView 
      initialProvinces={provinces} 
      initialCategories={categories} 
    />
  );
}
