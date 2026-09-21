import React, { useEffect, useMemo, useState } from "react";
import { X, Search, UserPlus, Loader2, Check } from "lucide-react";
import { getCustomersApi, addCustomerApi } from "@/lib/customerApi";

const emptyCustomer = { name: "", phone: "", email: "" };

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function CustomerPicker({ isOpen, onClose, onSelect, selectedId }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newCustomer, setNewCustomer] = useState(emptyCustomer);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSearch("");
    setError("");
    setShowAdd(false);
    setNewCustomer(emptyCustomer);
    setLoading(true);
    getCustomersApi()
      .then(setCustomers)
      .catch((err) => {
        setCustomers([]);
        setError(getErrorMessage(err, "Could not load customers"));
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    const qDigits = q.replace(/\s+/g, "");
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        (c.phone || "").replace(/\s+/g, "").includes(qDigits)
    );
  }, [customers, search]);

  if (!isOpen) return null;

  const openAddForm = () => {
    // prefill from whatever the cashier already typed in the search box
    const typed = search.trim();
    const looksLikePhone = /^[0-9+\s-]+$/.test(typed);
    setNewCustomer({
      name: typed && !looksLikePhone ? typed : "",
      phone: typed && looksLikePhone ? typed : "",
      email: "",
    });
    setError("");
    setShowAdd(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }

    setSaving(true);
    try {
      const created = await addCustomerApi({
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim() || null,
      });
      onSelect(created);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Could not add customer"));
    } finally {
      setSaving(false);
    }
  };

  const handlePick = (customer) => {
    onSelect(customer);
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {showAdd ? "Add New Customer" : "Select Customer"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}

        {showAdd ? (
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                required
                placeholder="e.g. Devyani Sen"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone</label>
              <input
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                required
                placeholder="98765 43210"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email (optional)</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="customer@email.com"
                className={inputClass}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-gray-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save & Select"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone or email..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
              />
            </div>

            <div className="border border-gray-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-[#312e81]" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-gray-400">
                  {customers.length === 0
                    ? "No customers yet."
                    : "No customer matches your search."}
                </p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handlePick(c)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-indigo-50/50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {c.phone}
                        {c.email ? ` · ${c.email}` : ""}
                      </p>
                    </div>
                    {selectedId === c.id && <Check className="h-4 w-4 text-[#312e81] shrink-0" />}
                  </button>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#312e81] text-[#312e81] hover:bg-indigo-50 font-semibold text-xs rounded-xl"
            >
              <UserPlus className="h-4 w-4" />
              Add new customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}