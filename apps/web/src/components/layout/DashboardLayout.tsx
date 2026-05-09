"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 sticky top-20 h-[calc(100vh-5rem)] z-30">
        <DashboardSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
