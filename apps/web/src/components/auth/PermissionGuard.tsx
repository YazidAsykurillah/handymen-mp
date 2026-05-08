"use client";

import { useAuthStore } from "@/store/auth.store";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string | string[];
  role?: string | string[];
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  children,
  permission,
  role,
  fallback = null,
}: PermissionGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <>{fallback}</>;

  // Check roles if provided
  if (role) {
    const requiredRoles = Array.isArray(role) ? role : [role];
    const hasRole = requiredRoles.some((r) => user.roles.includes(r));
    if (!hasRole) return <>{fallback}</>;
  }

  // Check permissions if provided
  if (permission) {
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requiredPermissions.every((p) => user.permissions.includes(p));
    if (!hasPermission) return <>{fallback}</>;
  }

  return <>{children}</>;
}
