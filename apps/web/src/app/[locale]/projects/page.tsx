import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProjectsView from "../../../views/ProjectsView";
import { apiClient } from "@/lib/api";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "projects" });
  return {
    title: `${t("title")} | ${process.env.NEXT_PUBLIC_APP_NAME || "Handyman"}`,
    description: t("subtitle"),
  };
}

export default async function ProjectsPage() {
  // SSR: Fetch initial categories and initial projects
  let initialCategories = [];
  let initialProjects: any = null;

  try {
    const [categoriesRes, projectsRes] = await Promise.all([
      apiClient.get("/categories"),
      apiClient.get("/portfolios?per_page=12")
    ]);
    
    initialCategories = categoriesRes.data.data;
    initialProjects = projectsRes.data;
  } catch (error) {
    console.error("Failed to fetch projects data:", error);
  }

  return (
    <ProjectsView 
      initialCategories={initialCategories} 
      initialProjects={initialProjects} 
    />
  );
}
