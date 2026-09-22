import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  User as UserIcon,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  getAllBranchesByStoreIdApi,
  createBranchApi,
  updateBranchApi,
  deleteBranchApi,
} from "@/lib/branchApi";
import { createBranchEmployeeApi, assignExistingEmployeeApi } from "@/lib/employeeApi";
import useMyStoreId from "@/lib/useMyStoreId";
import BranchForm from "./BranchForm";
import AssignManagerForm from "./AssignManagerForm";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function BranchList() {
  const { storeId, loading: storeLoading } = useMyStoreId();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [assigningBranch, setAssigningBranch] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    if (storeLoading) return;
    if (!storeId) {
      setLoading(false);
      return;
    }
    fetchBranches();
  }, [storeId, storeLoading]);

  const fetchBranches = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getAllBranchesByStoreIdApi(storeId);
      setBranches(data);
    } catch (err) {
      setBranches([]);
      setLoadError(getErrorMessage(err, "Could not load branches"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingBranch(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleEditClick = (branch) => {
    setEditingBranch(branch);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingBranch) {
        await updateBranchApi(editingBranch.id, formData);
      } else {
        await createBranchApi({ ...formData, storeId });
      }
      setIsFormOpen(false);
      fetchBranches();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save branch"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this branch? This cannot be undone.")) return;
    try {
      await deleteBranchApi(id);
      fetchBranches();
    } catch (err) {
      alert(getErrorMessage(err, "Could not delete branch"));
    }
  };

  const handleAssignClick = (branch) => {
    setAssigningBranch(branch);
    setAssignError("");
    setIsAssignFormOpen(true);
  };

  // formData.mode is "new" (create an account) or "existing" (attach a signed-up account)
  const handleAssignSubmit = async (formData) => {
    setAssigning(true);
    setAssignError("");
    try {
      if (formData.mode === "existing") {
        await assignExistingEmployeeApi(assigningBranch.id, {
          email: formData.email,
          role: "ROLE_BRANCH_MANAGER",
        });
      } else {
        const { mode, ...details } = formData;
        await createBranchEmployeeApi(assigningBranch.id, {
          ...details,
          role: "ROLE_BRANCH_MANAGER",
        });
      }

      setIsAssignFormOpen(false);
      fetchBranches();
    } catch (err) {
      setAssignError(getErrorMessage(err, "Could not assign manager"));
    } finally {
      setAssigning(false);
    }
  };

  const noStore = !storeLoading && !storeId;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Branches</h1>
          <p className="text-sm text-gray-400">{branches.length} branches under your store</p>
        </div>
        <button
          onClick={handleAddClick}
          disabled={!storeId}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md transition-colors disabled:bg-gray-400"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </button>
      </div>

      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {loadError}
        </div>
      )}

      {loading || storeLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : noStore ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          You haven't created your store yet. Go to Dashboard and create your store first.
        </div>
      ) : branches.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          No branches yet. Add your first branch to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-800 text-sm">{branch.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditClick(branch)}
                    className="p-1.5 text-gray-400 hover:text-[#312e81] hover:bg-indigo-50 rounded-lg"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#312e81] shrink-0" />
                  {branch.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#312e81] shrink-0" />
                  {branch.phone}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-3.5 w-3.5 text-[#312e81] shrink-0" />
                    {branch.manager ? branch.manager.fullName : "No manager assigned"}
                  </div>
                  <button
                    onClick={() => handleAssignClick(branch)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#312e81] hover:underline"
                  >
                    <UserPlus className="h-3 w-3" />
                    {branch.manager ? "Change" : "Assign"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-50">
                {branch.workingDays?.map((day) => (
                  <span
                    key={day}
                    className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-gray-400 pt-1">
                {branch.openTime} – {branch.closeTime}
              </div>
            </div>
          ))}
        </div>
      )}

      <BranchForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBranch}
        saving={saving}
        error={formError}
      />

      <AssignManagerForm
        isOpen={isAssignFormOpen}
        onClose={() => setIsAssignFormOpen(false)}
        onSubmit={handleAssignSubmit}
        saving={assigning}
        branchName={assigningBranch?.name}
        error={assignError}
      />
    </div>
  );
}