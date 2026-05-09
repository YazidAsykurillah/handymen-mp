"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    setMounted(true);
    if (mounted && hasHydrated && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [mounted, hasHydrated, isAuthenticated, router]);

  // Wait for both mounting and hydration
  if (!mounted || !hasHydrated) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, we return null while the useEffect redirects
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
