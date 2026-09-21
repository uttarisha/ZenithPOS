import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = { fullName: "", email: "", phone: "", password: "" };

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]";

export default function CashierForm({ isOpen, onClose, onSubmit, initialData, saving, error }) {
  const [mode, setMode] = useState("new"); // "new" | "existing"
  const [formData, setFormData] = useState(emptyForm);
  const [existingEmail, setExistingEmail] = useState("");

  useEffect(() => {
    setMode("new");
    setExistingEmail("");
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        password: "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!initialData && mode === "existing") {
      onSubmit({ mode: "existing", email: existingEmail.trim() });
    } else {
      onSubmit({ mode: "new", ...formData, role: "ROLE_BRANCH_CASHIER" });
    }
  };

  const tabClass = (active) =>
    `flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
      active ? "bg-[#312e81] text-white" : "text-gray-600 hover:bg-white"
    }`;

  const showExisting = !initialData && mode === "existing";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Cashier" : "Add Cashier"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!initialData && (
          <>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
              <button type="button" onClick={() => setMode("new")} className={tabClass(mode === "new")}>
                New cashier
              </button>
              <button
                type="button"
                onClick={() => setMode("existing")}
                className={tabClass(mode === "existing")}
              >
                Existing account
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              {mode === "new"
                ? "This creates a new Cashier account for this branch."
                : "For someone who already signed up as a Cashier and isn't assigned to a branch yet. Enter the email they signed up with."}
            </p>
          </>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {showExisting ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Email of the signed-up account
              </label>
              <input
                type="email"
                value={existingEmail}
                onChange={(e) => setExistingEmail(e.target.value)}
                required
                placeholder="cashier@email.com"
                className={inputClass}
              />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Priya Nair"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="cashier@email.com"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 90000 00000"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {initialData ? "New Password (leave blank to keep current)" : "Temporary Password"}
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!initialData}
                  placeholder="Set a login password"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md disabled:bg-gray-400"
            >
              {saving ? "Saving..." : initialData ? "Update" : showExisting ? "Add Cashier" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}