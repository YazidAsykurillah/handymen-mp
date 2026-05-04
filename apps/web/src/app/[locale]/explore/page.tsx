import ExploreView from "../../../views/ExploreView";
import { apiClient } from "@/lib/api";

export default async function ExplorePage() {
  // SSR: Fetch initial categories for filters and initial handymen
  let initialCategories = [];
  let initialHandymen: any = null;
  let initialProvinces = [];

  try {
    const [categoriesRes, handymenRes, provincesRes] = await Promise.all([
      apiClient.get("/categories"),
      apiClient.get("/handymen?per_page=12"),
      apiClient.get("/provinces")
    ]);
    
    initialCategories = categoriesRes.data.data;
    initialHandymen = handymenRes.data;
    initialProvinces = provincesRes.data.data;
  } catch (error) {
    console.error("Failed to fetch explore data:", error);
  }

  return (
    <ExploreView 
      initialCategories={initialCategories} 
      initialHandymen={initialHandymen} 
      initialProvinces={initialProvinces}
    />
  );
}
