import WelcomeView from "@/views/auth/WelcomeView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | Cari Tukang",
};

export default function WelcomePage() {
  return <WelcomeView />;
}
