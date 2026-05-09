"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountSettingsView() {
  const t = useTranslations("auth");
  const dt = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  // User Form State
  const [name, setName] = useState(user?.name || "");
  const [whatsapp, setWhatsapp] = useState(user?.phone || "");
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingUser(true);
    try {
      await apiClient.put("/auth/profile", { name, whatsapp });
      // update local store
      if (user) {
        setAuth({ ...user, name, phone: whatsapp }, useAuthStore.getState().token!);
      }
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error(t("passwordMismatch"));
    }
    setIsUpdatingPassword(true);
    try {
      await apiClient.put("/auth/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Password update failed.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
          {dt("accountSettings")}
        </h1>
        <p className="text-muted-foreground">{dt("description")}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 border-b border-border/40 flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-heading font-semibold">Basic Details</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateUser} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input value={user.email} disabled className="h-12 rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>{t("name")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl border-border bg-white" />
              </div>
              <div className="space-y-2">
                <Label>{t("whatsapp")}</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} type="tel" className="h-12 rounded-xl border-border bg-white" />
              </div>
              <Button type="submit" disabled={isUpdatingUser} className="h-11 rounded-xl px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                {isUpdatingUser ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 border-b border-border/40 flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-heading font-semibold">Security</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="h-12 rounded-xl border-border bg-white" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="h-12 rounded-xl border-border bg-white" />
                <p className="text-xs text-muted-foreground">{t("passwordRequirements")}</p>
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="h-12 rounded-xl border-border bg-white" />
              </div>
              <Button type="submit" disabled={isUpdatingPassword} className="h-11 rounded-xl px-8 border border-border" variant="outline">
                {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
