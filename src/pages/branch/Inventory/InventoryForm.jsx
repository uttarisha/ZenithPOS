import React, { useEffect, useMemo, useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { getProductsByStoreIdApi } from "@/lib/productApi";

export default function InventoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  saving,
  storeId,
  error,
  existingProductIds = [],
}) {
  const isEdit = !!initialData;

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [quantity, setQuantity] = useState(""); // edit mode
  const [quantities, setQuantities] = useState({}); // add mode: { productId: "12" }
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fillValue, setFillValue] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setSearch("");
    setCategoryFilter("");
    setFillValue("");
    setQuantities({});
    setQuantity(initialData ? initialData.quantity ?? "" : "");

    if (storeId && !initialData) {
      setLoadingProducts(true);
      getProductsByStoreIdApi(storeId)
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setLoadingProducts(false));
    }
  }, [initialData, isOpen, storeId]);

  // products not yet in this branch's inventory
  const available = useMemo(() => {
    const existing = new Set(existingProductIds.map(String));
    return products.filter((p) => !existing.has(String(p.id)));
  }, [products, existingProductIds]);

  const categoryNames = useMemo(
    () => [...new Set(available.map((p) => p.category?.name).filter(Boolean))].sort(),
    [available]
  );

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return available.filter((p) => {
      if (categoryFilter && p.category?.name !== categoryFilter) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    });
  }, [available, search, categoryFilter]);

  const selectedItems = available.filter((p) => {
    const value = quantities[p.id];
    return value !== undefined && value !== "" && Number(value) >= 0;
  });

  if (!isOpen) return null;

  const setQty = (id, value) => setQuantities((prev) => ({ ...prev, [id]: value }));

  const applyToShown = () => {
    if (fillValue === "" || Number(fillValue) < 0) return;
    setQuantities((prev) => {
      const next = { ...prev };
      shown.forEach((p) => {
        next[p.id] = fillValue;
      });
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      onSubmit({ quantity: parseInt(quantity, 10) });
      return;
    }
    onSubmit(
      selectedItems.map((p) => ({
        productId: Number(p.id),
        quantity: parseInt(quantities[p.id], 10),
        name: p.name,
      }))
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? "Update Stock" : "Add Inventory"}
            </h2>
            {!isEdit && (
              <p className="text-xs text-gray-400">
                Enter a quantity next to each product you want to add. Blank rows are skipped.
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEdit ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Product</label>
                <input
                  disabled
                  value={`${initialData.product?.name || "Product"}${
                    initialData.product?.sku ? ` (${initialData.product.sku})` : ""
                  }`}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Quantity in Stock</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
                />
              </div>
            </>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#312e81]"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-[#312e81]"
                >
                  <option value="">All categories</option>
                  {categoryNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Same quantity for everything shown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Set quantity for all {shown.length} shown:</span>
                <input
                  type="number"
                  min="0"
                  value={fillValue}
                  onChange={(e) => setFillValue(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-24 px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-[#312e81]"
                />
                <button
                  type="button"
                  onClick={applyToShown}
                  disabled={fillValue === "" || shown.length === 0}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#312e81] font-semibold rounded-md disabled:opacity-50"
                >
                  Apply
                </button>
              </div>

              {/* Product list */}
              <div className="border border-gray-200 rounded-xl max-h-72 overflow-y-auto divide-y divide-gray-100">
                {loadingProducts ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-[#312e81]" />
                  </div>
                ) : shown.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-gray-400">
                    {available.length === 0
                      ? "Every product in your store is already in this branch's inventory."
                      : "No products match your search."}
                  </p>
                ) : (
                  shown.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400">
                          <span className="font-mono">{p.sku}</span>
                          {p.category?.name ? ` · ${p.category.name}` : ""}
                        </p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={quantities[p.id] ?? ""}
                        onChange={(e) => setQty(p.id, e.target.value)}
                        placeholder="Qty"
                        className="w-24 px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#312e81]"
                      />
                    </div>
                  ))
                )}
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
              disabled={saving || (!isEdit && selectedItems.length === 0)}
              className="flex-1 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Update"
                : `Add ${selectedItems.length} ${selectedItems.length === 1 ? "product" : "products"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}