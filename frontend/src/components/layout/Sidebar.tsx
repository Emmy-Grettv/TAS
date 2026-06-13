"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  ShieldCheck,
  CalendarCheck,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      title: "Customers",
      href: "/customers",
      icon: Users,
      adminOnly: false,
    },
    {
      title: "Messaging",
      href: "/messaging",
      icon: MessageSquare,
      adminOnly: false,
    },
    {
      title: "Bookings",
      href: "/bookings",
      icon: CalendarCheck,
      adminOnly: false,
    },
    {
      title: "Quotations",
      href: "/quotations",
      icon: FileText,
      adminOnly: false,
    },
    {
      title: "User Management",
      href: "/users",
      icon: ShieldCheck,
      adminOnly: true,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-zinc-950 text-zinc-300">
      <div className="flex h-14 items-center border-b border-zinc-800 px-6">
        <span className="text-lg font-bold text-white tracking-tight">
          <span className="text-[#2D9B4E]">Tegano</span> CMS
        </span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item, index) => {
            if (item.adminOnly && user?.role !== "admin") return null;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-zinc-50",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-[#2D9B4E]/10 text-[#2D9B4E] hover:bg-[#2D9B4E]/20"
                    : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
