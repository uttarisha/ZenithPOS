import React, { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { getAllStoresApi } from "@/lib/superAdminApi";
import { getAllBranchesByStoreIdApi } from "@/lib/branchApi";

export default function AllBranchesView() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBranches();
  }, []);

  const fetchAllBranches = async () => {
    setLoading(true);
    try {
      const stores = await getAllStoresApi();
      const results = await Promise.all(
        stores.map(async (store) => {
          const branchList = await getAllBranchesByStoreIdApi(store.id);
          return branchList.map((b) => ({ ...b, storeBrand: store.brand }));
        })
      );
      setBranches(results.flat());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">All Branches</h1>
        <p className="text-sm text-gray-400">{branches.length} branches across every store</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : branches.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          No branches found on the platform yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-indigo-50/20">
                  <td className="px-4 py-3 font-medium text-slate-800">{b.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                      {b.storeBrand}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="h-3 w-3" /> {b.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {b.manager ? b.manager.fullName : "No manager assigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}