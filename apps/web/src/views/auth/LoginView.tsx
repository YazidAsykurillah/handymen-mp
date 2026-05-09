"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginView() {
  const t = useTranslations("auth");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await apiClient.post("/auth/login", { email, password });
      setAuth(res.data.data.user, res.data.data.token);
      toast.success(t("loginSuccess"));
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        toast.error(t("loginError"));
      } else {
        toast.error(err.response?.data?.message || "Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-xs text-destructive mt-1">{errors[field][0]}</p>;
  };

  return (
    <main className="flex-1 flex min-h-[calc(100vh-5rem)]">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-[45%] bg-primary relative items-start justify-center overflow-hidden pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 px-16 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-6">
              {t("login")}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {t("loginTagline")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-start justify-center p-6 pt-12 md:p-12 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            {t("login")}
          </h1>
          <p className="text-muted-foreground mb-8 text-sm lg:hidden">
            {t("loginTagline")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email">{t("email")}</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="h-12 rounded-xl border-border bg-white"
                required
              />
              <FieldError field="email" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">{t("password")}</Label>
                <Link
                  href="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="h-12 rounded-xl pr-12 border-border bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <FieldError field="password" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t("loggingIn")}
                </>
              ) : (
                t("login")
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {t("noAccount")}{" "}
            <Link
              href="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              {t("register")}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
