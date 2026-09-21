import React, { useEffect, useState } from "react";
import { Store, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { getStoreByAdminApi, createStoreApi } from "@/lib/storeApi";
import RevenueDashboard from "./RevenueDashboard"; // same folder as this file

const STATUS_STYLES = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  BLOCKED: "bg-red-50 text-red-700 border-red-200",
};

export default function StoreDashboard() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    brand: "",
    description: "",
    storeType: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const data = await getStoreByAdminApi();
      setStore(data);
    } catch (err) {
      setError("Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const payload = {
        brand: formData.brand,
        description: formData.description,
        storeType: formData.storeType,
        contact: {
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
        },
      };

      const created = await createStoreApi(payload);
      setStore(created);
    } catch (err) {
      setError(err.message || "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
      </div>
    );
  }

  // No store yet — first-time setup form
  if (!store) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#312e81] rounded-xl flex items-center justify-center mx-auto mb-3">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Create Your Store</h1>
            <p className="text-sm text-gray-400 mt-1">
              Set up your store profile to get started
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateStore} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Store / Brand Name</label>
              <input
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleInputChange}
                required
                placeholder="e.g. Zenith Mart"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Store Type</label>
              <input
                name="storeType"
                type="text"
                value={formData.storeType}
                onChange={handleInputChange}
                required
                placeholder="e.g. Retail, Grocery, Apparel"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A short description of your store..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Full store address"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Contact Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="store@email.com"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:bg-gray-400"
            >
              {creating ? "Creating..." : "Create Store"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Store exists — dashboard view
  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{store.brand}</h1>
          <p className="text-sm text-gray-400">{store.storeType}</p>
        </div>
        <span
          className={`px-3 py-1.5 text-xs font-bold rounded-full border ${
            STATUS_STYLES[store.status] || STATUS_STYLES.PENDING
          }`}
        >
          {store.status}
        </span>
      </div>

      {store.status === "PENDING" && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          Your store is awaiting approval from the platform administrator. Some
          features may be limited until it's approved.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Store Details</h2>
          <p className="text-sm text-gray-500">
            {store.description || "No description added yet."}
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

      {/* Revenue summary */}
      <RevenueDashboard />
    </div>
  );
}