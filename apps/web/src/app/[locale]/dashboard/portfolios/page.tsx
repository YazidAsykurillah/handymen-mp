import PortfolioManagementView from "@/views/dashboard/PortfolioManagementView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Portfolios | Handyman Dashboard",
};

export default function PortfoliosPage() {
  return <PortfolioManagementView />;
}
