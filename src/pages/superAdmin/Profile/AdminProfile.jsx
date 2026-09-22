import React, { useEffect, useState } from "react";
import { ShieldCheck, Mail, Phone, Loader2 } from "lucide-react";
import { getMyAdminProfileApi } from "@/lib/superAdminApi";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAdminProfileApi()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#312e81] rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
            <p className="text-sm text-gray-400">Your platform administrator account</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">Full Name</p>
            <p className="text-sm text-slate-800 font-medium">{profile.fullName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#312e81]" />
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#312e81]" />
            <p className="text-sm text-gray-600">{profile.phone}</p>
          </div>
          <span className="inline-block text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
            {profile.role?.replace("ROLE_", "")}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Profile editing isn't available yet — your backend doesn't currently expose an
          endpoint to update your own account details.
        </p>
      </div>
    </div>
  );
}