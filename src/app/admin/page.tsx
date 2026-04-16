"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    activeAuctions: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      // Allow only admin
      if (!user || user.role !== "admin") return;

      // Return dummy data immediately if demo user
      if (user.id === "demo-admin-id-mocked") {
        setStats({
          totalUsers: 142,
          totalSellers: 38,
          activeAuctions: 85,
        });
        setLoading(false);
        return;
      }

      try {
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { count: sellersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "seller");

        const { count: auctionsCount } = await supabase
          .from("auctions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        setStats({
          totalUsers: usersCount || 0,
          totalSellers: sellersCount || 0,
          activeAuctions: auctionsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-red-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Sellers",
      value: stats.totalSellers,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Active Auctions",
      value: stats.activeAuctions,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of platform activity and key metrics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/users"
              className="flex items-center justify-between p-4 rounded-lg border hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="size-5 text-slate-600" />
                <span className="font-medium text-slate-700">Manage Users</span>
              </div>
              <span className="text-sm text-slate-500">View & Edit All Profiles</span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <AlertTriangle className="size-10 text-amber-500 mb-2" />
          <h3 className="font-semibold text-slate-900">System Status</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            All systems are functioning normally. 
          </p>
          <span className="inline-flex items-center gap-1.5 py-1 px-3 mt-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Operational
          </span>
        </div>
      </div>
    </div>
  );
}
