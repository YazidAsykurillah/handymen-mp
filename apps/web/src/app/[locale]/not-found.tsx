"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-9xl font-heading font-black text-primary/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-background px-4 py-2 rounded-2xl shadow-xl border border-border/40">
              <p className="text-2xl font-heading font-bold text-primary">
                {t("notFoundTitle")}
              </p>
            </div>
          </div>
        </div>

      <div className="space-y-4">
        <p className="text-muted-foreground text-lg">
          {t("notFoundDescription")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          variant="outline"
          className="rounded-full gap-2 px-8 h-12"
          onClick={() => window.history.back()}
        >
          <MoveLeft className="w-4 h-4" />
          {t("goBack")}
        </Button>
        <Link href="/">
          <Button className="rounded-full gap-2 px-8 h-12 bg-primary text-white shadow-lg shadow-primary/20">
            <Home className="w-4 h-4" />
            {t("goHome")}
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}
