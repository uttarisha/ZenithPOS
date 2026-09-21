import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, Layers } from "lucide-react";
import {
  getProductsByStoreIdApi,
  searchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/lib/productApi";
import useMyStoreId from "@/lib/useMyStoreId";
import ProductForm from "./ProductForm";
import BulkProductForm from "./BulkProductForm";
import CategoryList from "./CategoryList";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function ProductList() {
  const { storeId, loading: storeLoading } = useMyStoreId();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (storeLoading) return;
    if (!storeId) {
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [search, storeId, storeLoading]);

  const fetchProducts = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = search
        ? await searchProductsApi(storeId, search)
        : await getProductsByStoreIdApi(storeId);
      setProducts(data);
    } catch (err) {
      setProducts([]);
      setLoadError(getErrorMessage(err, "Could not load products"));
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormError("");
    setNotice("");
    setIsFormOpen(true);
  };

  const openBulkForm = () => {
    setNotice("");
    setIsBulkOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormError("");
    setNotice("");
    setIsFormOpen(true);
  };

  const handleBulkCreated = (count) => {
    setNotice(`${count} ${count === 1 ? "product" : "products"} added successfully.`);
    fetchProducts();
  };

  const handleFormSubmit = async (formData) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct.id, formData);
      } else {
        await createProductApi({ ...formData, storeId });
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save product"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProductApi(id);
      fetchProducts();
    } catch (err) {
      alert(getErrorMessage(err, "Could not delete product"));
    }
  };

  const noStore = !storeLoading && !storeId;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Catalog</h1>
          <p className="text-sm text-gray-400">Products &amp; categories for your store</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openBulkForm}
            disabled={!storeId}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#312e81] text-[#312e81] hover:bg-indigo-50 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
          >
            <Layers className="h-4 w-4" />
            Bulk Add
          </button>
          <button
            onClick={openAddForm}
            disabled={!storeId}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md transition-colors disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg">
          {notice}
        </div>
      )}

      {storeLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : noStore ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-sm">
          You haven't created your store yet. Go to Dashboard and create your store first.
        </div>
      ) : (
        <>
          <CategoryList storeId={storeId} />

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#312e81]"
            />
          </div>

          {loadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              {loadError}
            </div>
          )}

          {loading ? (
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
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">MRP</th>
                    <th className="px-4 py-3">Selling Price</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-indigo-50/20">
                      <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] bg-indigo-50 text-[#312e81] font-semibold px-2 py-0.5 rounded">
                          {product.category?.name || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">₹{product.mrp?.toFixed(2)}</td>
                      <td className="px-4 py-3 font-bold text-[#312e81]">
                        ₹{product.sellingPrice?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditForm(product)}
                            className="p-1.5 text-gray-400 hover:text-[#312e81] hover:bg-indigo-50 rounded-lg"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        saving={saving}
        storeId={storeId}
        error={formError}
      />

      <BulkProductForm
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        storeId={storeId}
        onCreated={handleBulkCreated}
      />
    </div>
  );
}