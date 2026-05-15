"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, Menu, LogOut, User, LayoutDashboard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");

  // Hydration-safe auth state
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { href: "/explore", label: t("explore") },
    { href: "/projects", label: t("projects") },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore — token might already be expired
    }
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  // Get initials for avatar
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Only show auth state after mount AND hydration to avoid hydration mismatch
  const showAuth = mounted && hasHydrated && isAuthenticated && user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 md:px-16 h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center gap-0">
            <Image src="/images/logo-transparent.png" alt="Handyman Logo" width={32} height={32} className="object-contain" />
            <span className="font-heading font-bold text-lg sm:text-2xl tracking-tight text-primary">
              {process.env.NEXT_PUBLIC_APP_NAME || "Handyman"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language Switcher Section */}
        <div className="flex items-center gap-2 ml-4 sm:ml-12">
          <Globe className="w-4 h-4 text-muted-foreground hidden xs:block" />
          <div className="flex items-center gap-3">
            <Link
              href={pathname}
              locale="id"
              className={`text-xs font-bold transition-colors ${locale === "id" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              ID
            </Link>
            <span className="text-border text-xs">|</span>
            <Link
              href={pathname}
              locale="en"
              className={`text-xs font-bold transition-colors ${locale === "en" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              EN
            </Link>
          </div>
        </div>

        {/* Actions Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          {showAuth ? (
            /* Logged-in: User Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{initials}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary hidden sm:inline max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <Link href="/dashboard" className="w-full">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    {t("dashboard")}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged-out: Login & Register */
            <>

              <Link href="/auth/register" className="hidden sm:block">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-semibold px-4 transition-all text-xs sm:text-sm whitespace-nowrap">
                  {t("register")}
                </Button>
              </Link>
              <Link href="/auth/login" className="hidden sm:block">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-4 sm:px-8 font-semibold shadow-sm transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap">
                  {t("signIn")}
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left">
                <SheetTitle className="font-heading font-bold text-2xl text-primary">
                  <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
                    <Image src="/images/logo-transparent.png" alt="Handyman Logo" width={28} height={28} className="object-contain" />
                    {process.env.NEXT_PUBLIC_APP_NAME || "Handyman"}
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8 px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-sm font-heading font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                {showAuth ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{initials}</span>
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-primary text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex-1 -mx-6">
                      <DashboardSidebar
                        hideMobileHeader
                        hideBorder
                        onLinkClick={handleLinkClick}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={handleLinkClick}
                      className="w-full"
                    >
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl py-6 text-lg font-bold shadow-sm transition-all active:scale-95">
                        {t("signIn")}
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={handleLinkClick}
                      className="w-full"
                    >
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground py-6 text-lg font-semibold">
                        {t("register")}
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
