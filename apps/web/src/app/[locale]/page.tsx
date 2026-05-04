import HomeView from "@/views/HomeView";
import { apiClient } from "@/lib/api";

export default async function Home() {
  // SSR: Fetch data on the server
  let initialCategories = [];
  let initialHandymen = [];

  try {
    const [categoriesRes, handymenRes] = await Promise.all([
      apiClient.get("/categories"),
      apiClient.get("/handymen?per_page=12&rating_min=4&sort=rating_avg&order=desc")
    ]);
    
    initialCategories = categoriesRes.data.data;
    initialHandymen = handymenRes.data.data;
  } catch (error) {
    console.error("Failed to fetch SSR data:", error);
  }

  return (
    <HomeView 
      initialCategories={initialCategories} 
      initialHandymen={initialHandymen} 
    />
  );
}
