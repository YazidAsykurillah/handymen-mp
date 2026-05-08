"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomeView() {
  const t = useTranslations("auth");

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-5rem)] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4"
        >
          {t("welcomeTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted-foreground text-lg leading-relaxed mb-10"
        >
          {t("welcomeSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/explore">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full gap-2 px-8 font-bold shadow-lg"
            >
              <Search className="w-5 h-5" />
              {t("welcomeExplore")}
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 font-semibold border-2"
            >
              <Home className="w-5 h-5" />
              {t("welcomeHome")}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
