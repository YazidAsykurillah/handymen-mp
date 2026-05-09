"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PermissionGuard from "@/components/auth/PermissionGuard";

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

interface HandymanProfile {
  id: number;
  name: string;
  bio: string | null;
  phone: string;
  whatsapp: string | null;
  province_id: number;
  city_id: number;
  categories: Category[];
}

interface ProfileSettingsViewProps {
  initialProvinces: Province[];
  initialCategories: Category[];
}

export default function ProfileSettingsView({
  initialProvinces,
  initialCategories,
}: ProfileSettingsViewProps) {
  const t = useTranslations("auth");
  const dt = useTranslations("dashboard");
  const ct = useTranslations("categories");
  const user = useAuthStore((s) => s.user);

  // Handyman Form State
  const [hmName, setHmName] = useState("");
  const [hmBio, setHmBio] = useState("");
  const [hmWhatsapp, setHmWhatsapp] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isUpdatingHandyman, setIsUpdatingHandyman] = useState(false);

  // Fetch Handyman Profile
  const { data: hmData, isLoading: isLoadingHm } = useQuery({
    queryKey: ["handyman-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/handyman/profile");
      return res.data.data as HandymanProfile;
    },
  });

  // Populate HM state when data arrives
  useEffect(() => {
    if (hmData) {
      setHmName(hmData.name || "");
      setHmBio(hmData.bio || "");
      setHmWhatsapp(hmData.whatsapp || "");
      setProvinceId(hmData.province_id?.toString() || "");
      setCityId(hmData.city_id?.toString() || "");
      setSelectedCategories(hmData.categories?.map((c) => c.id) || []);
    }
  }, [hmData]);

  // Fetch cities when province changes
  const { data: citiesData } = useQuery({
    queryKey: ["cities", provinceId],
    queryFn: async () => {
      const res = await apiClient.get(`/cities?province_id=${provinceId}`);
      return res.data.data as City[];
    },
    enabled: !!provinceId,
  });
  const cities = citiesData || [];

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleUpdateHandyman = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingHandyman(true);
    try {
      await apiClient.put("/handyman/profile", {
        name: hmName,
        bio: hmBio,
        whatsapp: hmWhatsapp,
        province_id: provinceId,
        city_id: cityId,
      });
      
      // Update categories in separate request
      await apiClient.put("/handyman/categories", {
        categories: selectedCategories,
      });

      toast.success("Professional profile updated.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setIsUpdatingHandyman(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
          {dt("profile")}
        </h1>
        <p className="text-muted-foreground">{dt("description")}</p>
      </div>

      <PermissionGuard role="handyman">
        {isLoadingHm ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-heading font-semibold">Marketplace Profile</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateHandyman} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={hmName} onChange={(e) => setHmName(e.target.value)} required className="h-12 rounded-xl border-border bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("province")}</Label>
                    <Select value={provinceId} onValueChange={(val) => { if(val) { setProvinceId(val); setCityId(""); } }}>
                      <SelectTrigger className="h-12 rounded-xl w-full border-border bg-white">
                        <SelectValue placeholder={t("selectProvince")}>
                          {provinceId ? initialProvinces.find(p => p.id.toString() === provinceId)?.name : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {initialProvinces.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("city")}</Label>
                    <Select value={cityId} onValueChange={(val) => { if(val) setCityId(val); }} disabled={!provinceId}>
                      <SelectTrigger className="h-12 rounded-xl w-full border-border bg-white">
                        <SelectValue placeholder={t("selectCity")}>
                          {cityId ? cities.find(c => c.id.toString() === cityId)?.name : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("whatsapp")}</Label>
                  <Input value={hmWhatsapp} onChange={(e) => setHmWhatsapp(e.target.value)} type="tel" className="h-12 rounded-xl border-border bg-white" />
                </div>

                <div className="space-y-2">
                  <Label>{dt("categories")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {initialCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-muted text-muted-foreground border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {ct(cat.slug)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("bio")}</Label>
                  <textarea
                    value={hmBio}
                    onChange={(e) => setHmBio(e.target.value)}
                    placeholder={t("bioPlaceholder")}
                    className="flex min-h-[120px] w-full rounded-xl border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>

                <Button type="submit" disabled={isUpdatingHandyman} className="h-11 rounded-xl px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                  {isUpdatingHandyman ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Professional Profile
                </Button>
              </form>
            </div>
          </div>
        )}
      </PermissionGuard>
    </div>
  );
}
