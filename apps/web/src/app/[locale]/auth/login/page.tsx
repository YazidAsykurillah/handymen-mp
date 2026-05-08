import LoginView from "@/views/auth/LoginView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Cari Tukang",
  description:
    "Sign in to your Cari Tukang account to manage your profile, connect with professionals, and more.",
};

export default function LoginPage() {
  return <LoginView />;
}
