"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import {
  LayoutDashboard,
  UserCircle,
  Images,
  Star,
  LogOut,
  Settings,
} from "lucide-react";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface DashboardSidebarProps {
  onLinkClick?: () => void;
  hideMobileHeader?: boolean;
  hideBorder?: boolean;
}

export default function DashboardSidebar({ 
  onLinkClick,
  hideMobileHeader = false,
  hideBorder = false
}: DashboardSidebarProps) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore token expiration
    }
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-background ${hideBorder ? "" : "border-r border-border/40"}`}>
      {/* Sidebar Header (Mobile Only Branding) */}
      {!hideMobileHeader && (
        <div className="p-6 lg:hidden border-b border-border/40">
          <Link href="/" onClick={handleClick} className="flex items-center gap-2">
            <Image
              src="/images/logo-transparent.png"
              alt="Handyman Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-heading font-bold text-2xl tracking-tight text-primary">
              {process.env.NEXT_PUBLIC_APP_NAME || "Handyman"}
            </span>
          </Link>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href="/dashboard"
          onClick={handleClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            pathname === "/dashboard"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          {t("overview")}
        </Link>

        <PermissionGuard role="handyman">
          <Link
            href="/dashboard/profile"
            onClick={handleClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              pathname === "/dashboard/profile"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <UserCircle className="w-5 h-5" />
            {t("profile")}
          </Link>
        </PermissionGuard>

        <PermissionGuard role="handyman">
          <Link
            href="/dashboard/portfolios"
            onClick={handleClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              pathname === "/dashboard/portfolios"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Images className="w-5 h-5" />
            {t("portfolios")}
          </Link>
        </PermissionGuard>

        <PermissionGuard role="user">
          <Link
            href="/dashboard/reviews"
            onClick={handleClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              pathname === "/dashboard/reviews"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Star className="w-5 h-5" />
            {t("myReviews")}
          </Link>
        </PermissionGuard>

        <Link
          href="/dashboard/account"
          onClick={handleClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            pathname === "/dashboard/account"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="w-5 h-5" />
          {t("accountSettings")}
        </Link>
      </nav>

      <div className="p-4 mt-auto border-t border-border/40">
        <button
          onClick={() => { handleLogout(); handleClick(); }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
