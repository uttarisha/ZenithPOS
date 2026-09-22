import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { getAllStoresApi, moderateStoreApi, deleteStoreApi, forceDeleteStoreApi } from "@/lib/superAdminApi";
import StoreApprovalPanel from "./StoreApprovalPanel";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getAllStoresApi();
      setStores(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (storeId, status) => {
    setSavingId(storeId);
    try {
      await moderateStoreApi(storeId, status);
      fetchStores();
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this store permanently? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deleteStoreApi(id);
      fetchStores();
    } catch (err) {
      const message = err?.response?.data?.message || "";
      const status = err?.response?.status;
      const looksLikeConstraintError = status === 500 || status === 409;

      if (looksLikeConstraintError) {
        const forceOk = confirm(
          "This store still has branches, orders, or other data attached, so it can't be deleted directly.\n\n" +
          "Permanently delete this store AND everything under it (branches, orders, inventory, employees, etc.)? This cannot be undone."
        );
        if (forceOk) {
          try {
            await forceDeleteStoreApi(id);
            fetchStores();
          } catch (forceErr) {
            alert(forceErr?.response?.data?.message || "Force delete failed.");
          }
        }
      } else {
        alert(message || "Failed to delete store.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stores</h1>
        <p className="text-sm text-gray-400">{stores.length} stores on the platform</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : (
        <div className="space-y-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">{store.brand}</h3>
                  <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                    {store.storeType}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Admin: {store.storeAdmin?.fullName} · {store.storeAdmin?.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StoreApprovalPanel
                  status={store.status}
                  saving={savingId === store.id}
                  onChange={(status) => handleStatusChange(store.id, status)}
                />
                <Link
                  to={`/super-admin/stores/${store.id}`}
                  className="p-2 text-gray-400 hover:text-[#312e81] hover:bg-indigo-50 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(store.id)}
                  disabled={deletingId === store.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  {deletingId === store.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {stores.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
              No stores registered yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}