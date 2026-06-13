"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, UserPlus, MessageCircle, Calendar, CalendarCheck, FileText, CheckCircle, Clock, XCircle, Send } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomerTable } from "@/components/customers/CustomerTable";

interface DashboardStats {
  totalCustomers: number;
  addedToday: number;
  addedThisMonth: number;
  totalMessagesSent: number;
  bookings: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  quotations: {
    total: number;
    sent: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [customerStatsRes, messageStatsRes, bookingsStatsRes, quotationsStatsRes] = await Promise.all([
          api.get("/customers/stats"),
          api.get("/messages/stats"),
          api.get("/bookings/stats"),
          api.get("/quotations/stats"),
        ]);
        
        setStats({
          totalCustomers: customerStatsRes.data.total,
          addedToday: customerStatsRes.data.today,
          addedThisMonth: customerStatsRes.data.thisMonth,
          totalMessagesSent: messageStatsRes.data.totalSent,
          bookings: bookingsStatsRes.data,
          quotations: quotationsStatsRes.data,
        });
      } catch (error) {
        toast.error("Failed to load dashboard statistics");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/customers/new">
            <Button className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Added Today"
          value={stats?.addedToday || 0}
          icon={UserPlus}
          loading={loading}
        />
        <StatCard
          title="Added This Month"
          value={stats?.addedThisMonth || 0}
          icon={Calendar}
          loading={loading}
        />
        <StatCard
          title="Total Messages Sent"
          value={stats?.totalMessagesSent || 0}
          icon={MessageCircle}
          loading={loading}
        />
      </div>

      <h2 className="text-xl font-semibold tracking-tight mt-4">Bookings & Quotations</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Bookings"
          value={stats?.bookings?.total || 0}
          icon={CalendarCheck}
          loading={loading}
        />
        <StatCard
          title="Pending Bookings"
          value={stats?.bookings?.pending || 0}
          icon={Clock}
          loading={loading}
        />
        <StatCard
          title="Approved Bookings"
          value={stats?.bookings?.approved || 0}
          icon={CheckCircle}
          loading={loading}
        />
        <StatCard
          title="Rejected Bookings"
          value={stats?.bookings?.rejected || 0}
          icon={XCircle}
          loading={loading}
        />
        <StatCard
          title="Total Quotations"
          value={stats?.quotations?.total || 0}
          icon={FileText}
          loading={loading}
        />
        <StatCard
          title="Quotations Sent"
          value={stats?.quotations?.sent || 0}
          icon={Send}
          loading={loading}
        />
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Customers</h2>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <CustomerTable limit={10} />
        </div>
      </div>
    </div>
  );
}
