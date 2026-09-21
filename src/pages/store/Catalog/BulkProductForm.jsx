import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { getCategoriesByStoreIdApi } from "@/lib/categoryApi";
import { createProductApi } from "@/lib/productApi";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

let rowCounter = 0;
const newRow = (data = {}) => ({
  id: ++rowCounter,
  name: "",
  sku: "",
  brand: "",
  mrp: "",
  sellingPrice: "",
  description: "",
  error: "",
  ...data,
});

const toNumber = (value) => {
  const n = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? "" : n;
};

// Column order: Product, SKU, Brand, MRP, Selling, Description
const parsePasted = (text) => {
  const rows = [];
  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;
    if (/^\|?\s*:?-{2,}/.test(line)) return; // markdown separator line

    let cells;
    if (line.includes("\t")) {
      cells = line.split("\t");
    } else if (line.startsWith("|") || line.includes(" | ")) {
      cells = line.split("|");
      if (cells[0].trim() === "") cells.shift();
      if (cells.length && cells[cells.length - 1].trim() === "") cells.pop();
    } else {
      cells = line.split(",");
    }
    cells = cells.map((c) => c.trim());

    if (cells.length < 2) return; // headings like "1. Fruits & Vegetables"
    if (/^product\b/i.test(cells[0]) && /sku/i.test(cells[1] || "")) return; // header row

    const [name, sku, brand, mrp, sellingPrice, ...rest] = cells;
    rows.push(
      newRow({
        name: name || "",
        sku: sku || "",
        brand: brand || "",
        mrp: toNumber(mrp),
        sellingPrice: toNumber(sellingPrice),
        description: rest.join(", "),
      })
    );
  });
  return rows;
};

export default function BulkProductForm({ isOpen, onClose, storeId, onCreated }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [rows, setRows] = useState([]);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isOpen) return;
    setCategoryId("");
    setPasteText("");
    setRows([newRow()]);
    setMessage({ type: "", text: "" });

    if (storeId) {
      getCategoriesByStoreIdApi(storeId)
        .then(setCategories)
        .catch(() => setCategories([]));
    }
  }, [isOpen, storeId]);

  if (!isOpen) return null;

  const filledRows = rows.filter((r) => r.name.trim() || r.sku.trim());

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value, error: "" } : r)));
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddPasted = () => {
    const parsed = parsePasted(pasteText);
    if (parsed.length === 0) {
      setMessage({
        type: "error",
        text: "Nothing to add. Use: Product, SKU, Brand, MRP, Selling, Description (one product per line).",
      });
      return;
    }
    setRows((prev) => [...prev.filter((r) => r.name || r.sku), ...parsed]);
    setPasteText("");
    setMessage({ type: "info", text: `${parsed.length} rows added to the table below. Review them, then create.` });
  };

  const handleCreate = async () => {
    setMessage({ type: "", text: "" });

    if (!categoryId) {
      setMessage({ type: "error", text: "Select a category first." });
      return;
    }
    if (filledRows.length === 0) {
      setMessage({ type: "error", text: "Add at least one product." });
      return;
    }

    // validate before calling the API
    let hasInvalid = false;
    const validated = rows.map((r) => {
      if (!(r.name.trim() || r.sku.trim())) return r;
      let error = "";
      if (!r.name.trim()) error = "Name is required";
      else if (!r.sku.trim()) error = "SKU is required";
      else if (r.mrp === "" || Number(r.mrp) < 0) error = "Enter a valid MRP";
      else if (r.sellingPrice === "" || Number(r.sellingPrice) < 0) error = "Enter a valid selling price";
      if (error) hasInvalid = true;
      return { ...r, error };
    });

    if (hasInvalid) {
      setRows(validated);
      setMessage({ type: "error", text: "Fix the highlighted rows and try again." });
      return;
    }

    setCreating(true);
    const failed = [];
    let created = 0;

    for (const row of validated.filter((r) => r.name.trim() || r.sku.trim())) {
      try {
        await createProductApi({
          name: row.name.trim(),
          sku: row.sku.trim(),
          brand: row.brand.trim(),
          description: row.description.trim(),
          mrp: Number(row.mrp),
          sellingPrice: Number(row.sellingPrice),
          categoryId: Number(categoryId),
          storeId,
        });
        created++;
      } catch (err) {
        failed.push({ ...row, error: getErrorMessage(err, "Could not create product") });
      }
    }

    setCreating(false);
    if (created > 0) onCreated(created);

    if (failed.length === 0) {
      onClose();
      return;
    }

    setRows(failed);
    setMessage({
      type: "error",
      text: `${created} created, ${failed.length} failed. The failed rows are still in the table with the reason.`,
    });
  };

  const messageStyles = {
    error: "bg-red-50 border-red-200 text-red-600",
    info: "bg-indigo-50 border-indigo-200 text-[#312e81]",
  };

  const cellInput =
    "w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-[#312e81]";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Bulk Add Products</h2>
            <p className="text-xs text-gray-400">Add many products to one category at once</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 border text-xs rounded-lg ${messageStyles[message.type] || messageStyles.info}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Category */}
          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-semibold text-slate-700">Category for all these products</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81] bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-[11px] text-gray-400">No categories yet. Create one first with "Add Category".</p>
            )}
          </div>

          {/* Paste box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Paste products (Product, SKU, Brand, MRP, Selling, Description)
            </label>
            <textarea
              rows={4}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={
                "Fresh Apples 1kg, FVG-APL-001, Spencer's, 180, 165, Fresh and crisp red apples\n" +
                "Fresh Bananas 1kg, FVG-BAN-002, Spencer's, 70, 60, Naturally sweet ripe bananas"
              }
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#312e81]"
            />
            <button
              type="button"
              onClick={handleAddPasted}
              disabled={!pasteText.trim()}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#312e81] font-semibold text-xs rounded-lg disabled:opacity-50"
            >
              Add to table
            </button>
          </div>

          {/* Grid */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="bg-slate-50 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-2 py-2 w-[18%]">Product</th>
                  <th className="px-2 py-2 w-[13%]">SKU</th>
                  <th className="px-2 py-2 w-[11%]">Brand</th>
                  <th className="px-2 py-2 w-[8%]">MRP (₹)</th>
                  <th className="px-2 py-2 w-[8%]">Selling (₹)</th>
                  <th className="px-2 py-2">Description</th>
                  <th className="px-2 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr className={row.error ? "bg-red-50/50" : ""}>
                      <td className="px-2 py-1.5">
                        <input className={cellInput} value={row.name} onChange={(e) => updateRow(row.id, "name", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input className={cellInput} value={row.sku} onChange={(e) => updateRow(row.id, "sku", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input className={cellInput} value={row.brand} onChange={(e) => updateRow(row.id, "brand", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="number" min="0" step="0.01" className={cellInput} value={row.mrp} onChange={(e) => updateRow(row.id, "mrp", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="number" min="0" step="0.01" className={cellInput} value={row.sellingPrice} onChange={(e) => updateRow(row.id, "sellingPrice", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input className={cellInput} value={row.description} onChange={(e) => updateRow(row.id, "description", e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                    {row.error && (
                      <tr className="bg-red-50/50">
                        <td colSpan={7} className="px-3 pb-2 text-[11px] text-red-600">
                          {row.error}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-xs text-gray-400">
                      No rows. Paste products above or add a row.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => setRows((prev) => [...prev, newRow()])}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#312e81] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add empty row
          </button>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 py-2.5 border border-gray-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || filledRows.length === 0}
              className="flex-1 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              {creating
                ? "Creating..."
                : `Create ${filledRows.length} ${filledRows.length === 1 ? "product" : "products"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}