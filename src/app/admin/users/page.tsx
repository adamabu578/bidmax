"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { UserRole, useAuth } from "../../../context/AuthContext";

interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfiles() {
      if (user?.id === "demo-admin-id-mocked") {
        setProfiles([
          { id: "usr-001", name: "Alice Johnson", role: "buyer", created_at: "2026-01-15T10:00:00Z" },
          { id: "usr-002", name: "Bob Smith", role: "seller", created_at: "2026-02-20T14:30:00Z" },
          { id: "usr-003", name: "Charlie Davis", role: "buyer", created_at: "2026-03-05T09:15:00Z" },
          { id: "usr-004", name: "Diana Evans", role: "admin", created_at: "2025-11-10T16:45:00Z" },
          { id: "usr-005", name: "Ethan Hunt", role: "seller", created_at: "2026-04-01T11:20:00Z" },
          { id: "usr-006", name: "Fiona Gallagher", role: "buyer", created_at: "2026-04-12T08:00:00Z" },
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setProfiles(data);
      } else if (error) {
        console.error("Error fetching profiles:", error);
      }
      setLoading(false);
    }

    fetchProfiles();
  }, [supabase]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      
      setProfiles(prev => 
        prev.map(p => p.id === userId ? { ...p, role: newRole } : p)
      );
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Users</h1>
        <p className="text-muted-foreground mt-2">
          View all registered users and manage their roles.
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {profile.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {profile.id}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={profile.role}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value as UserRole)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
