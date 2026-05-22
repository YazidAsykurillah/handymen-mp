"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@/i18n/navigation";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import {
  User,
  Wrench,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Province {
  id: number;
  name: string;
}
interface City {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface RegisterViewProps {
  initialProvinces: Province[];
  initialCategories: Category[];
}

export default function RegisterView({
  initialProvinces,
  initialCategories,
}: RegisterViewProps) {
  const t = useTranslations("auth");
  const ct = useTranslations("categories");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [tab, setTab] = useState("handyman");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Handyman fields
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Fetch cities when province changes
  const { data: citiesData } = useQuery({
    queryKey: ["register-cities", provinceId],
    queryFn: async () => {
      const res = await apiClient.get(`/cities?province_id=${provinceId}`);
      return res.data.data as City[];
    },
    enabled: !!provinceId,
  });
  const cities = citiesData || [];

  // Reset city when province changes
  useEffect(() => {
    setCityId("");
  }, [provinceId]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    if (password.length < 8) {
      setErrors({ password: [t("passwordRequirements")] });
      return;
    }
    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: [t("passwordMismatch")] });
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === "user") {
        const res = await apiClient.post("/auth/register", {
          name,
          email,
          whatsapp,
          password,
          password_confirmation: passwordConfirmation,
        });
        setAuth(res.data.data.user, res.data.data.token);
        toast.success(t("registerSuccess"));
        router.push("/auth/welcome");
      } else {
        const res = await apiClient.post("/auth/register/handyman", {
          name,
          email,
          whatsapp,
          password,
          password_confirmation: passwordConfirmation,
          province_id: provinceId,
          city_id: cityId,
          categories: selectedCategories,
        });
        setAuth(res.data.data.user, res.data.data.token);
        toast.success(t("handymanRegisterSuccess"));
        router.push("/auth/handyman-success");
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        toast.error(err.response?.data?.message || "Registration failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <p className="text-xs text-destructive mt-1">{errors[field][0]}</p>
    );
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
              {t("register")}
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              {t("registerTagline")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-start justify-center p-6 pt-12 md:p-12 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <h1 className="text-3xl font-heading font-bold text-primary mb-2 lg:hidden">
            {t("register")}
          </h1>
          <p className="text-muted-foreground mb-8 lg:hidden text-sm">
            {t("registerTagline")}
          </p>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-xl bg-muted">
              <TabsTrigger
                value="user"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 font-semibold"
              >
                <User className="w-4 h-4" />
                {t("registerAsUser")}
              </TabsTrigger>
              <TabsTrigger
                value="handyman"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 font-semibold"
              >
                <Wrench className="w-4 h-4" />
                {t("registerAsHandyman")}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              {/* Common Fields */}
              <div className="space-y-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className="h-12 rounded-xl border-border bg-white"
                    required
                  />
                  <FieldError field="name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
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
                  <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={t("whatsappPlaceholder")}
                    className="h-12 rounded-xl border-border bg-white"
                    required
                  />
                  <FieldError field="whatsapp" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
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
                  <p className="text-xs text-muted-foreground">
                    {t("passwordRequirements")}
                  </p>
                  <FieldError field="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">
                    {t("confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="passwordConfirmation"
                      type={showConfirm ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder={t("confirmPasswordPlaceholder")}
                      className="h-12 rounded-xl pr-12 border-border bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FieldError field="password_confirmation" />
                </div>
              </div>

              {/* Handyman-specific Fields */}
              <TabsContent value="handyman" className="mt-0">
                <div className="space-y-4 pt-2 border-t border-border mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("province")}</Label>
                      <Select
                        value={provinceId}
                        onValueChange={(val) => setProvinceId(val || "")}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-border bg-white w-full">
                          <SelectValue placeholder={t("selectProvince")}>
                            {provinceId ? initialProvinces.find(p => p.id.toString() === provinceId)?.name : null}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {initialProvinces.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id.toString()}
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError field="province_id" />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("city")}</Label>
                      <Select
                        value={cityId}
                        onValueChange={(val) => setCityId(val || "")}
                        disabled={!provinceId}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-border bg-white w-full">
                          <SelectValue placeholder={t("selectCity")}>
                            {cityId ? cities.find(c => c.id.toString() === cityId)?.name : null}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id.toString()}
                            >
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError field="city_id" />
                    </div>
                  </div>



                  <div className="space-y-2">
                    <Label>{t("categories")}</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("selectCategories")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {initialCategories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                              }`}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            )}
                            {ct(cat.slug)}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError field="categories" />
                  </div>


                </div>
              </TabsContent>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base mt-6 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {t("registering")}
                  </>
                ) : (
                  t("register")
                )}
              </Button>
            </form>
          </Tabs>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {t("hasAccount")}{" "}
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
