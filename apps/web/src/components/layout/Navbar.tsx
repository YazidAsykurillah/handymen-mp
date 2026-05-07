"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/explore", label: t("explore") },
    { href: "/projects", label: t("projects") },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 md:px-16 h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center gap-0">
            <Image src="/images/logo-transparent.png" alt="Handyman Logo" width={32} height={32} className="object-contain" />
            <span className="font-heading font-bold text-2xl tracking-tight text-primary">
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
          <Link href="/auth/login" className="hidden sm:block">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-semibold px-4 transition-all text-xs sm:text-sm whitespace-nowrap">
              {t("signIn")}
            </Button>
          </Link>

          <Link href="/auth/register" className="hidden sm:block">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-4 sm:px-8 font-semibold shadow-sm transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap">
              {t("register")}
            </Button>
          </Link>

          {/* Mobile Menu Trigger moved to the right */}
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
              <nav className="flex flex-col gap-6 mt-12 px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-xl font-heading font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                <Link
                  href="/auth/login"
                  onClick={handleLinkClick}
                  className="text-xl font-heading font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={handleLinkClick}
                  className="text-xl font-heading font-semibold text-secondary hover:text-secondary/80 transition-colors"
                >
                  {t("register")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
