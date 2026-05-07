import HandymanDetailView from "@/views/HandymanDetailView";
import { apiClient } from "@/lib/api";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const response = await apiClient.get(`/handymen/${slug}`);
    const handyman = response.data.data;

    const location = [handyman.city?.name, handyman.province?.name]
      .filter(Boolean)
      .join(", ");

    return {
      title: locale === "id"
        ? `${handyman.name} - Tukang Profesional di ${location || "Indonesia"} | Cari Tukang`
        : `${handyman.name} - Professional Handyman in ${location || "Indonesia"} | Cari Tukang`,
      description: handyman.bio
        ? handyman.bio.substring(0, 160)
        : locale === "id"
          ? `Profil ${handyman.name}, tukang profesional dan terpercaya di ${location || "Indonesia"}.`
          : `Profile of ${handyman.name}, a professional and trusted handyman in ${location || "Indonesia"}.`,
    };
  } catch {
    return {
      title: "Handyman Profile | Cari Tukang",
    };
  }
}

export default async function HandymanDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let initialData = null;

  try {
    const response = await apiClient.get(`/handymen/${slug}`);
    initialData = response.data.data;
  } catch (error) {
    console.error("Failed to fetch handyman:", error);
  }

  return <HandymanDetailView initialData={initialData} slug={slug} />;
}
