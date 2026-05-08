"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Clock, Search, ShieldCheck, Bell, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HandymanSuccessView() {
  const t = useTranslations("auth");

  const steps = [
    { icon: Clock, text: t("handymanSuccessStep1") },
    { icon: ShieldCheck, text: t("handymanSuccessStep2") },
    { icon: Bell, text: t("handymanSuccessStep3") },
  ];

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-5rem)] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-xl"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
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
          {t("handymanSuccessTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted-foreground text-lg leading-relaxed mb-10"
        >
          {t("handymanSuccessSubtitle")}
        </motion.p>

        {/* Steps Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card className="p-8 rounded-2xl border border-border bg-white shadow-sm text-left mb-10">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
              What happens next?
            </h3>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/explore">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full gap-2 px-8 font-bold shadow-lg"
            >
              <Search className="w-5 h-5" />
              {t("handymanSuccessExplore")}
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 font-semibold border-2"
            >
              <Home className="w-5 h-5" />
              {t("handymanSuccessHome")}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
