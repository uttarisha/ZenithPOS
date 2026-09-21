import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag, Loader2, X } from "lucide-react";
import {
  getCategoriesByStoreIdApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "@/lib/categoryApi";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function CategoryList({ storeId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      return;
    }
    fetchCategories();
  }, [storeId]);

  const fetchCategories = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getCategoriesByStoreIdApi(storeId);
      setCategories(data);
    } catch (err) {
      setCategories([]);
      setLoadError(getErrorMessage(err, "Could not load categories"));
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setName("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, { name });
      } else {
        await createCategoryApi({ name, storeId });
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save category"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategoryApi(id);
      fetchCategories();
    } catch (err) {
      alert(getErrorMessage(err, "Could not delete category"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Categories</h2>
        <button
          onClick={openAddForm}
          disabled={!storeId}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-xs rounded-lg transition-colors disabled:bg-gray-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[#312e81]" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <Tag className="h-3 w-3 text-[#312e81]" />
              {cat.name}
              <button
                onClick={() => openEditForm(cat)}
                className="text-gray-400 hover:text-[#312e81] p-0.5"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-gray-400 hover:text-red-600 p-0.5"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-gray-400">No categories yet.</p>
          )}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Category name"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#312e81]"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold text-sm rounded-xl shadow-md disabled:bg-gray-400"
              >
                {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}