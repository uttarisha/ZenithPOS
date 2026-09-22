import React, { useState } from "react";
import { Search, User, Mail, Phone, Loader2 } from "lucide-react";
import { getUserByIdApi } from "@/lib/superAdminApi";

export default function UserDetails() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const data = await getUserByIdApi(userId.trim());
      setUser(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Lookup</h1>
        <p className="text-sm text-gray-400">Look up any user on the platform by their ID</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="Enter user ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : searched && !user ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm max-w-md">
          No user found with that ID.
        </div>
      ) : user ? (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#312e81] rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{user.fullName}</p>
              <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                {user.role?.replace("ROLE_", "").replace("_", " ") || "User"}
              </span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#312e81] shrink-0" /> {user.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#312e81] shrink-0" /> {user.phone}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}