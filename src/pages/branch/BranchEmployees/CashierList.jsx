import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Mail, Phone, Loader2 } from "lucide-react";
import {
  getBranchEmployeesApi,
  createBranchEmployeeApi,
  assignExistingEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from "@/lib/employeeApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";
import CashierForm from "./CashierForm";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function CashierList() {
  const { branchId } = useMyBranch();

  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    fetchCashiers();
  }, [branchId]);

  const fetchCashiers = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getBranchEmployeesApi(branchId, "ROLE_BRANCH_CASHIER");
      setCashiers(data);
    } catch (err) {
      setCashiers([]);
      setLoadError(getErrorMessage(err, "Could not load cashiers"));
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingCashier(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (cashier) => {
    setEditingCashier(cashier);
    setFormError("");
    setIsFormOpen(true);
  };

  // formData.mode is "new" (create an account) or "existing" (attach a signed-up account)
  const handleFormSubmit = async (formData) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingCashier) {
        const { mode, ...details } = formData;
        await updateEmployeeApi(editingCashier.id, details);
      } else if (formData.mode === "existing") {
        await assignExistingEmployeeApi(branchId, {
          email: formData.email,
          role: "ROLE_BRANCH_CASHIER",
        });
      } else {
        const { mode, ...details } = formData;
        await createBranchEmployeeApi(branchId, details);
      }
      setIsFormOpen(false);
      fetchCashiers();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save cashier"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this cashier?")) return;
    try {
      await deleteEmployeeApi(id);
      fetchCashiers();
    } catch (err) {
      alert(getErrorMessage(err, "Could not remove cashier"));
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cashiers</h1>
          <p className="text-sm text-gray-400">{cashiers.length} cashiers at this branch</p>
        </div>
        <button
          onClick={openAddForm}
          disabled={!branchId}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md transition-colors disabled:bg-gray-400"
        >
          <Plus className="h-4 w-4" />
          Add Cashier
        </button>
      </div>

      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {loadError}
        </div>
      )}

      {!branchId ? (
        <NoBranchNotice />
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cashiers.map((cashier) => (
                <tr key={cashier.id} className="hover:bg-indigo-50/20">
                  <td className="px-4 py-3 font-medium text-slate-800">{cashier.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3 w-3" /> {cashier.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <Phone className="h-3 w-3" /> {cashier.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditForm(cashier)}
                        className="p-1.5 text-gray-400 hover:text-[#312e81] hover:bg-indigo-50 rounded-lg"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cashier.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cashiers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No cashiers added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CashierForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCashier}
        saving={saving}
        error={formError}
      />
    </div>
  );
}