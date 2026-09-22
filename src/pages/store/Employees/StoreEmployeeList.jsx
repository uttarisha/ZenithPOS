import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Mail, Phone, Loader2 } from "lucide-react";
import {
  getStoreEmployeesApi,
  createStoreEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from "@/lib/employeeApi";
import useMyStoreId from "@/lib/useMyStoreId";
import StoreEmployeeForm from "./StoreEmployeeForm";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function StoreEmployeeList() {
  const { storeId, loading: storeLoading } = useMyStoreId();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (storeLoading) return;
    if (!storeId) {
      setLoading(false);
      return;
    }
    fetchEmployees();
  }, [storeId, storeLoading]);

  const fetchEmployees = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getStoreEmployeesApi(storeId);
      setEmployees(data);
    } catch (err) {
      setEmployees([]);
      setLoadError(getErrorMessage(err, "Could not load employees"));
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingEmployee(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (employee) => {
    setEditingEmployee(employee);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingEmployee) {
        await updateEmployeeApi(editingEmployee.id, formData);
      } else {
        await createStoreEmployeeApi(storeId, formData);
      }
      setIsFormOpen(false);
      fetchEmployees();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save employee"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this employee?")) return;
    try {
      await deleteEmployeeApi(id);
      fetchEmployees();
    } catch (err) {
      alert(getErrorMessage(err, "Could not remove employee"));
    }
  };

  const noStore = !storeLoading && !storeId;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Store Employees</h1>
          <p className="text-sm text-gray-400">Store managers working across your store</p>
        </div>
        <button
          onClick={openAddForm}
          disabled={!storeId}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md transition-colors disabled:bg-gray-400"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <p className="text-xs text-gray-400 -mt-4">
        Branch managers and cashiers are added from within each branch, not here.
      </p>

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
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-indigo-50/20">
                  <td className="px-4 py-3 font-medium text-slate-800">{emp.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3 w-3" /> {emp.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <Phone className="h-3 w-3" /> {emp.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                      {emp.role?.replace("ROLE_", "").replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditForm(emp)}
                        className="p-1.5 text-gray-400 hover:text-[#312e81] hover:bg-indigo-50 rounded-lg"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No store employees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <StoreEmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
        saving={saving}
        error={formError}
      />
    </div>
  );
}