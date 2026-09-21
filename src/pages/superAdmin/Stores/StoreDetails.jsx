import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { getStoreByIdApi, moderateStoreApi } from "@/lib/superAdminApi";
import { getAllBranchesByStoreIdApi } from "@/lib/branchApi";
import { getStoreEmployeesApi } from "@/lib/employeeApi";
import StoreApprovalPanel from "./StoreApprovalPanel";

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [storeData, branchList, employeeList] = await Promise.all([
        getStoreByIdApi(id),
        getAllBranchesByStoreIdApi(id),
        getStoreEmployeesApi(id),
      ]);
      setStore(storeData);
      setBranches(branchList);
      setEmployees(employeeList);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    setSaving(true);
    try {
      const updated = await moderateStoreApi(id, status);
      setStore(updated);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen p-8 text-center text-gray-400 text-sm">
        Store not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <Link
        to="/super-admin/stores"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#312e81]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Stores
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{store.brand}</h1>
          <p className="text-sm text-gray-400">{store.storeType}</p>
        </div>
        <StoreApprovalPanel status={store.status} saving={saving} onChange={handleStatusChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Store Details</h2>
          <p className="text-sm text-gray-500">{store.description}</p>
          <p className="text-xs text-gray-400">
            Owner: {store.storeAdmin?.fullName} · {store.storeAdmin?.email}
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Contact Information</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#312e81] shrink-0" />
              {store.contact?.address}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#312e81] shrink-0" />
              {store.contact?.phone}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#312e81] shrink-0" />
              {store.contact?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-3">
          Branches ({branches.length})
        </h2>
        {branches.length === 0 ? (
          <p className="text-sm text-gray-400">No branches under this store yet.</p>
        ) : (
          <div className="space-y-2">
            {branches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-700">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.address}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {b.manager ? b.manager.fullName : "No manager assigned"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-3">
          Store Employees ({employees.length})
        </h2>
        {employees.length === 0 ? (
          <p className="text-sm text-gray-400">No store-level employees yet.</p>
        ) : (
          <div className="space-y-2">
            {employees.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0"
              >
                <p className="font-medium text-slate-700">{e.fullName}</p>
                <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                  {e.role?.replace("ROLE_", "").replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}