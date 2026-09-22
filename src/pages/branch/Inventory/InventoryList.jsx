import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  getInventoryByBranchIdApi,
  createInventoryApi,
  updateInventoryApi,
  deleteInventoryApi,
} from "@/lib/inventoryApi";
import useMyBranch from "@/lib/useMyBranch";
import InventoryForm from "./InventoryForm";

const LOW_STOCK_THRESHOLD = 10;

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function InventoryList() {
  const { branchId, storeId } = useMyBranch();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    fetchInventory();
  }, [branchId]);

  const fetchInventory = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getInventoryByBranchIdApi(branchId);
      setInventory(data);
    } catch (err) {
      setInventory([]);
      setLoadError(getErrorMessage(err, "Could not load inventory"));
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormError("");
    setNotice("");
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormError("");
    setNotice("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    setFormError("");

    try {
      // Editing one item
      if (editingItem) {
        await updateInventoryApi(editingItem.id, formData);
        setIsFormOpen(false);
        fetchInventory();
        return;
      }

      // Adding many products at once (formData is an array)
      let created = 0;
      const failed = [];

      for (const item of formData) {
        try {
          await createInventoryApi({
            productId: item.productId,
            quantity: item.quantity,
            branchId,
          });
          created++;
        } catch (err) {
          failed.push(`${item.name}: ${getErrorMessage(err, "could not be added")}`);
        }
      }

      await fetchInventory();

      if (failed.length === 0) {
        setIsFormOpen(false);
        setNotice(`${created} ${created === 1 ? "product" : "products"} added to inventory.`);
      } else {
        setFormError(
          `${created} added, ${failed.length} failed:\n` + failed.join("\n")
        );
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save inventory"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this item from inventory?")) return;
    try {
      await deleteInventoryApi(id);
      fetchInventory();
    } catch (err) {
      alert(getErrorMessage(err, "Could not remove item"));
    }
  };

  const existingProductIds = inventory.map((item) => item.productId ?? item.product?.id);

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-sm text-gray-400">Stock levels for this branch</p>
        </div>
        <button
          onClick={openAddForm}
          disabled={!branchId}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md transition-colors disabled:bg-gray-400"
        >
          <Plus className="h-4 w-4" />
          Add Stock
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg">
          {notice}
        </div>
      )}

      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {loadError}
        </div>
      )}

      {!branchId ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          No branch is assigned to your account yet. Ask your store admin to assign you to a
          branch, then log out and log in again.
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/20">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.product?.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.product?.sku}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        item.quantity < LOW_STOCK_THRESHOLD ? "text-red-600" : "text-slate-700"
                      }`}
                    >
                      {item.quantity < LOW_STOCK_THRESHOLD && (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      )}
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {item.lastUpdate ? new Date(item.lastUpdate).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-1.5 text-gray-400 hover:text-[#312e81] hover:bg-indigo-50 rounded-lg"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No inventory records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        saving={saving}
        storeId={storeId}
        error={formError}
        existingProductIds={existingProductIds}
      />
    </div>
  );
}