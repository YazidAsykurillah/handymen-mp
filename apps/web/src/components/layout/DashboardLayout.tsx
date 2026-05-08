"use client";

import { useState } from "react";
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
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [open, setOpen] = useState(false);

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-background border-r border-border/40">
      <div className="p-6 lg:hidden border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-transparent.png"
            alt="Handyman Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-heading font-bold text-2xl tracking-tight text-primary">
            Handyman
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            pathname === "/dashboard"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          {t("overview")}
        </Link>

        <Link
          href="/dashboard/profile"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            pathname === "/dashboard/profile"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <UserCircle className="w-5 h-5" />
          {t("profile")}
        </Link>

        <PermissionGuard role="handyman">
          <Link
            href="/dashboard/portfolios"
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
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
      </nav>

      <div className="p-4 mt-auto border-t border-border/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 sticky top-20 h-[calc(100vh-5rem)] z-30">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center h-16 px-4 bg-background border-b border-border/40">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-72 border-r-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <span className="font-heading font-bold text-xl text-primary">Handyman</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
