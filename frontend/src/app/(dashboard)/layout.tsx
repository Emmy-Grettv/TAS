"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect to login if there's no token and we're mounted
    if (mounted && !token) {
      router.replace("/login");
    }
  }, [token, mounted, router]);

  // Show loading or nothing while checking auth
  if (!mounted) {
    return null;
  }

  // If no token, show nothing (will redirect)
  if (!token) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
